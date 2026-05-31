with open("styles.css", "a", encoding="utf-8") as f:
    f.write("""
/* Custom sleek scrollbar for the works modal on smaller screens */
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
}
""")
print("Patch 3 completed.")
