const deleteBtn = document.querySelectorAll(".fa-trash");
const updateBtn = document.querySelectorAll(".fa-edit");
const item = document.querySelectorAll(".item span");

Array.from(deleteBtn).forEach((element) => {
  element.addEventListener("click", deleteItem);
});

Array.from(updateBtn).forEach((element) => {
  element.addEventListener("click", editItem);
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

async function editItem() {
  const itemText = this.parentNode.childNodes[1].innerText;
  const newItemText = prompt("Enter the updated text:", itemText);

  if (newItemText) {
    try {
      const updatedItem = {
        itemFromJS: itemText,
        newItemText: newItemText,
      };

      const response = await fetch("/updatePost", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      const data = await response.json();
      console.log(data);
      location.reload();
    } catch (err) {
      console.log(err);
    }
  }
}
