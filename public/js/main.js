const deleteBtn = document.querySelectorAll(".fa-trash");
const item = document.querySelectorAll(".item span");
const createPost = document.querySelector("#createPost");
const updatePost = document.querySelectorAll(".updateBtn");


Array.from(post).forEach((element) => {
  element.addEventListener("click", createPost);
});

async function createPost() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("createPost", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        'itemFromJS': itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

Array.from(post).forEach((element) => {
  element.addEventListener("click", updatePost);
});

async function updatePost() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("updatePost", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        'itemFromJS': itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

Array.from(post).forEach((element) => {
  element.addEventListener("click", deletePost);
});

async function deletePost() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deletePost", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        'itemFromJS': itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}