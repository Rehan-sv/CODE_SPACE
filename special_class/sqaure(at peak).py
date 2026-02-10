n=7
for row in range(n):
    for col in range(n):
        draw_star = False

        # BORDER  (manually reasoning)
        if row == 0:
            draw_star = True
        elif row == n - 1:
            draw_star = True
        elif col == 0:
            draw_star = True
        elif col == n - 1:
            draw_star = True

        # DIAGONAL 1 (top-left to bottom-right)
        # Instead of row == col, compare using a loop
        for k in range(n):
            if row == k and col == k:
                draw_star = True

        # DIAGONAL 2 (top-right to bottom-left)
        # Instead of row + col == n-1, compute reverse index
        reverse_col = (n - 1) - row
        if col == reverse_col:
            draw_star = True

        # PRINT BASED ON decision
        if draw_star:
            print("*", end=" ")
        else:
            print(" ", end=" ")
    print()
