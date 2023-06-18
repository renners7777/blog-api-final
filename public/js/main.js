const deleteBtns = document.querySelectorAll(".deleteBtn");
const updateBtns = document.querySelectorAll(".updateBtn");

Array.from(deleteBtns).forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", deleteItem);
});

Array.from(updateBtns).forEach((updateBtn) => {
  updateBtn.addEventListener("click", updateItem);
});

async function deleteItem() {
  const listItem = this.parentNode;
  const itemText = listItem.querySelector("span").innerText;

  try {
    const response = await fetch("/deletePost", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemFromJS: itemText }),
    });

    if (response.ok) {
      console.log("Post deleted");
      listItem.remove();
    } else {
      console.error("Failed to delete post");
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateItem() {
  const listItem = this.parentNode;
  const postId = this.dataset.id;
  const updateItem = prompt("Enter updated post:");

  if (updateItem) {
    try {
      const response = await fetch(`/updatePost/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedContent: updateItem }),
      });

      if (response.ok) {
        console.log("Post updated successfully");
        const postContent = listItem.querySelector("span");
        postContent.innerText = updateItem;
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
