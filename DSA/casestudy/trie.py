"""Aho-Corasick keyword scanner with a readable, table-free terminal display."""

from collections import deque
import os
import sys
from textwrap import fill


class TrieNode:
    """One state in the Aho-Corasick automaton."""

    def __init__(self):
        self.children = {}
        self.fail = None
        self.outputs = []


class AhoCorasick:
    def __init__(self, patterns):
        self.root = TrieNode()
        self.patterns = []
        self._build_trie(patterns)
        self._build_failure_links()

    def _build_trie(self, patterns):
        seen = set()
        for pattern in patterns:
            if not pattern or pattern in seen:
                continue
            seen.add(pattern)
            self.patterns.append(pattern)

            node = self.root
            for char in pattern:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.outputs.append(pattern)

    def _build_failure_links(self):
        self.root.fail = self.root
        queue = deque()

        for child in self.root.children.values():
            child.fail = self.root
            queue.append(child)

        while queue:
            current = queue.popleft()

            for char, child in current.children.items():
                fallback = current.fail
                while fallback is not self.root and char not in fallback.children:
                    fallback = fallback.fail

                if char in fallback.children and fallback.children[char] is not child:
                    child.fail = fallback.children[char]
                else:
                    child.fail = self.root

                child.outputs.extend(child.fail.outputs)
                queue.append(child)

    def search(self, text, case_insensitive=False):
        """Return (pattern, start, exclusive_end) for every matching occurrence."""
        if case_insensitive:
            return self._search_ignore_case(text)

        matches = []
        node = self.root

        for index, char in enumerate(text):
            while node is not self.root and char not in node.children:
                node = node.fail

            node = node.children.get(char, self.root)
            for pattern in node.outputs:
                matches.append((pattern, index - len(pattern) + 1, index + 1))

        return matches

    def _search_ignore_case(self, text):
        # Keep the first spelling of patterns that differ only in letter case.
        labels = {}
        for pattern in self.patterns:
            labels.setdefault(pattern.casefold(), pattern)

        # Unicode case conversion can change a character's length. Record
        # boundaries so every result still refers to the original input text.
        parts = []
        boundaries = {0: 0}
        length = 0
        for index, char in enumerate(text):
            folded = char.casefold()
            parts.append(folded)
            length += len(folded)
            boundaries[length] = index + 1

        folded_scanner = AhoCorasick(labels)
        matches = folded_scanner.search("".join(parts))
        return [
            (labels[pattern], boundaries[start], boundaries[end])
            for pattern, start, end in matches
            if start in boundaries and end in boundaries
        ]


WIDTH = 72
SAMPLE_TEXT = (
    "INFO user login successful; WARNING suspicious login detected; "
    "ALERT malware found; blocked attack from unknown host; "
    "INFO system scan complete."
)


def supports_color():
    """Enable optional terminal color; redirected output remains plain text."""
    if not sys.stdout.isatty() or "NO_COLOR" in os.environ:
        return False
    if os.environ.get("TERM") == "dumb":
        return False
    if os.name != "nt":
        return True

    try:
        import ctypes
        from ctypes import wintypes

        kernel = ctypes.windll.kernel32
        kernel.GetStdHandle.argtypes = [wintypes.DWORD]
        kernel.GetStdHandle.restype = wintypes.HANDLE
        kernel.GetConsoleMode.argtypes = [wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD)]
        kernel.SetConsoleMode.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        handle = kernel.GetStdHandle(wintypes.DWORD(-11).value)
        mode = wintypes.DWORD()
        if not kernel.GetConsoleMode(handle, ctypes.byref(mode)):
            return False
        return bool(kernel.SetConsoleMode(handle, mode.value | 0x0004))
    except (AttributeError, OSError):
        return False


USE_COLOR = False
STYLES = {"bold": "1", "muted": "90", "cyan": "36", "green": "32"}


def styled(text, *styles):
    if not USE_COLOR:
        return str(text)
    codes = ";".join(STYLES[style] for style in styles)
    return f"\033[{codes}m{text}\033[0m"


def section(title):
    print()
    print(styled(title, "bold", "cyan"))
    print(styled("-" * WIDTH, "muted"))


def ask_choice(prompt, choices, default):
    while True:
        answer = input(prompt).strip().lower() or default
        if answer in choices:
            return answer
        print("Please choose " + " or ".join(choices) + ".")


def read_patterns():
    print("Which keywords would you like to find?")
    print(styled("Separate them with commas: malware, attack, login, virus, bad", "muted"))
    while True:
        raw = input("\nKeywords: ")
        patterns = list(dict.fromkeys(item.strip() for item in raw.split(",") if item.strip()))
        if patterns:
            return patterns
        print("Enter at least one keyword to begin.")


def match_context(text, start, end, padding=24):
    left = max(0, start - padding)
    right = min(len(text), end + padding)

    def clean(value):
        return " ".join(value.split())

    before = text[left:start].replace("\r", " ").replace("\n", " ")
    after = text[end:right].replace("\r", " ").replace("\n", " ")
    hit = styled("[" + clean(text[start:end]) + "]", "bold", "green")
    prefix = "..." if left else ""
    suffix = "..." if right < len(text) else ""
    return prefix + before + hit + after + suffix


def show_results(text, patterns, matches, ignore_case):
    grouped = {}
    for pattern, start, end in matches:
        grouped.setdefault(pattern, []).append((start, end))

    # Use the same deduplication rule as the selected search mode.
    unique_patterns = {}
    for pattern in patterns:
        key = pattern.casefold() if ignore_case else pattern
        unique_patterns.setdefault(key, pattern)

    matched_keys = {p.casefold() if ignore_case else p for p in grouped}
    missing = [label for key, label in unique_patterns.items() if key not in matched_keys]

    section("Scan complete")
    if matches:
        match_word = "match" if len(matches) == 1 else "matches"
        keyword_word = "keyword" if len(grouped) == 1 else "keywords"
        print(styled(f"{len(matches)} {match_word} across {len(grouped)} {keyword_word}", "bold", "green"))
        print(f"Searched {len(text)} characters for {len(unique_patterns)} keywords.")

        section("What the scanner found")
        for pattern, positions in grouped.items():
            count = len(positions)
            label = "1 match" if count == 1 else f"{count} matches"
            print(f"\n  {styled(pattern, 'bold', 'cyan')}  ({label})")
            for number, (start, end) in enumerate(positions, 1):
                print(f"\n    {number}. Positions {start}-{end}")
                print("       " + match_context(text, start, end))

        print()
        print(styled("Positions start at 0; the end position is excluded.", "muted"))
    else:
        print("No matching keywords were found in this text.")
        print(f"Checked {len(text)} characters against {len(unique_patterns)} keywords.")

    if missing:
        section("Keywords not found")
        print(fill(", ".join(missing), width=WIDTH))

    section("Understanding the results")
    print(fill(
        "A keyword match points to text worth reviewing. Read the surrounding "
        "message to understand the event; a match alone does not establish a threat.",
        width=WIDTH,
    ))


def show_complexity():
    section("Algorithm notes")
    print("P = total pattern length; N = text length; Z = reported matches.")
    print("Trie insertion: O(P) expected with dictionary-based transitions.")
    print("Core search: O(N + Z). Results are grouped in search order.")
    print(fill(
        "Standard bounded-alphabet analysis gives O(P) failure-link construction. "
        "Actual build time and memory also depend on transition handling and "
        "the inherited output lists copied between states.",
        width=WIDTH,
    ))


def main():
    global USE_COLOR
    USE_COLOR = supports_color()

    print()
    print(styled("AHO-CORASICK", "bold", "cyan"))
    print("Cybersecurity keyword scanner")
    print(styled("Find several keywords in one scan, including overlapping matches.", "muted"))
    section("Your keywords")
    patterns = read_patterns()

    section("Choose your text")
    print("1. Try the sample cybersecurity log")
    print("2. Enter your own text")
    choice = ask_choice("\nYour choice [1]: ", ("1", "2"), "1")

    if choice == "2":
        print("\nPaste one line of text below.")
        text = input("Text: ")
    else:
        text = SAMPLE_TEXT
        print("\nSample log:")
        print(fill(text, width=WIDTH))

    answer = ask_choice("\nIgnore letter case? [Y/n]: ", ("y", "yes", "n", "no"), "y")
    ignore_case = answer in ("y", "yes")

    scanner = AhoCorasick(patterns)
    matches = scanner.search(text, case_insensitive=ignore_case)
    show_results(text, scanner.patterns, matches, ignore_case)
    show_complexity()
    print()


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\nScan ended.")
