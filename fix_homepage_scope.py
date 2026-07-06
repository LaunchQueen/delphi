import sys

path = "/Users/maureenwest/Documents/GitHub/delphi/src/App.jsx"

with open(path, "r") as f:
    content = f.read()

old = "Delphi gives B2B buyers an independent second opinion on any software decision — translating vendor promises into a personalized assessment of what the tool actually requires for your business, and whether your organization is ready to make it work."

new = "Delphi gives B2B buyers an independent second opinion on sales and marketing software decisions — translating vendor promises into a personalized assessment of what the tool actually requires for your business, and whether your organization is ready to make it work."

count = content.count(old)
if count == 0:
    print("ERROR: Target text not found. Check the file.")
    sys.exit(1)
elif count > 1:
    print(f"ERROR: Found {count} matches. Expected exactly 1. Aborting.")
    sys.exit(1)

content = content.replace(old, new)

with open(path, "w") as f:
    f.write(content)

print("Done. Hero paragraph updated to sales and marketing software.")
