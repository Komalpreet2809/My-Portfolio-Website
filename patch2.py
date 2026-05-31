import re

with open("styles.css", "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: @media (max-width: 1024px) .work-item.expanded
# We want to change overflow: auto -> overflow: hidden, and add padding: 0
target1 = """@media (max-width: 1024px) {
  .work-item.expanded {
    overflow: auto;
    overflow-x: hidden;
    padding-top: 0;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }"""
rep1 = """@media (max-width: 1024px) {
  .work-item.expanded {
    overflow: hidden;
    padding: 0;
  }"""

# Fix 2: .work-item.expanded .work-header in max-width: 1024px
target2 = """  .work-item.expanded .work-header {
    position: relative;
    padding-top: 1rem;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    width: calc(100% + 3rem);
    padding-left: 1.5rem;
    padding-right: 4rem;
    flex: 0 0 auto;
  }"""
rep2 = """  .work-item.expanded .work-header {
    position: relative;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 4rem;
    flex: 0 0 auto;
  }"""

# Fix 3: .work-item.expanded .work-details in max-width: 1024px
target3 = """  .work-item.expanded .work-details {
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
  }"""
rep3 = """  .work-item.expanded .work-details {
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
  }"""

# Fix 4: .work-item.expanded in max-width: 768px (around line 4304)
# It has: inset: 1rem; padding: 0 1.5rem 1rem; margin: 0;
content = re.sub(
    r"(\.work-item\.expanded\s*\{\s*[^}]*)padding:\s*0\s+1\.5rem\s+1rem;",
    r"\1padding: 0;",
    content
)

content = content.replace(target1, rep1)
content = content.replace(target2, rep2)
content = content.replace(target3, rep3)

with open("styles.css", "w", encoding="utf-8") as f:
    f.write(content)
print("Patch 2 completed.")
