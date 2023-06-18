const deleteBtn = document.querySelectorAll(".fa-trash");
const updateBtns = document.querySelectorAll(".updateBtn");
const item = document.querySelectorAll(".item span");

Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

Array.from(updateBtns).forEach((element) => {
  element.addEventListener("click", updateItem);
});

async function deleteItem() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("/deletePost", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function updateItem(event) {
  const postId = event.target.dataset.id;

  try {
    const response = await fetch(`/updatePost/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("Post updated successfully");
      location.reload();
    } else {
      console.error("Failed to update post");
    }
  } catch (error) {
    console.error(error);
  }
}