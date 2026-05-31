import re
with open("styles.css", "r", encoding="utf-8") as f:
    content = f.read()

# Find the @media (max-width: 1024px) { block (it's around line 2200)
# We can search for the exact match of the .work-details block in the file
target = """  .work-item.expanded .work-details {
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
  }"""

replacement = """  .work-item.expanded .work-details {
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    width: calc(100% + 3rem);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .work-item.expanded .work-details::-webkit-scrollbar {
    width: 6px;
  }
  .work-item.expanded .work-details::-webkit-scrollbar-track {
    background: transparent;
  }
  .work-item.expanded .work-details::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  .work-item.expanded .work-details::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }"""

new_content = content.replace(target, replacement)
if content == new_content:
    print("Could not find the target block!")
else:
    with open("styles.css", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced.")
