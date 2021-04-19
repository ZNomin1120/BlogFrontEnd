const state = {};

if (location.pathname === "/login.html") {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.replace("http://localhost:3000/admin.html");
  }
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const error = document.getElementById("error");

  const sendData = async () => {
    try {
      const data = {
        username: username.value,
        password: password.value,
      };
      const result = await axios.post(
        "http://localhost:8000/api/v1/login",
        data
      );
      state.user = result.data.message;

      localStorage.setItem("token", result.data.token);
      window.location.replace("http://localhost:3000/admin.html");
    } catch (err) {
      error.classList.remove("error-close");
      setTimeout(() => {
        error.classList.add("error-close");
      }, 3000);
    }
  };
  loginButton.addEventListener("click", () => {
    sendData();
  });
} else if (location.pathname === "/register.html") {
  const lastname = document.getElementById("lastname");
  const firstname = document.getElementById("firstname");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const registerButton = document.getElementById("register");
  const error = document.getElementById("error");

  const sendData = async () => {
    try {
      if (
        !lastname.value ||
        !firstname.value ||
        !username.value ||
        !password.value
      ) {
        throw "error";
      }
      const data = {
        lastname: lastname.value,
        firstname: firstname.value,
        username: username.value,
        password: password.value,
      };
      const result = await axios.post(
        "http://localhost:8000/api/v1/register",
        data
      );
      state.user = result.data.data;

      localStorage.setItem("token", result.data.token);
      window.location.replace("http://localhost:3000/admin.html");
    } catch (err) {
      error.classList.remove("error-close");
      setTimeout(() => {
        error.classList.add("error-close");
      }, 3000);
      console.log(err);
    }
  };
  registerButton.addEventListener("click", () => {
    sendData();
  });
}
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.replace("http://localhost:3000/");
});

// ----------------------------------------------------------------

const fetchBlogs = async () => {
  try {
    let result = await axios.get("http://127.0.0.1:8000/api/v1/blog");

    result = result.data;

    return result;
  } catch (error) {
    console.log(error);
  }
};
const renderBlogs = (data) => {
  data.forEach(renderBlog);
};

const renderBlog = (data) => {
  const date = data.createdAt.split("T");
  const html = `
        <div class="table" id=${data.id}>
                <p>
                    <img src="http://localhost:8000/api/v1/blog/photo/${data.photo}" />
                </p>
                <p>${data.title}</p>
                <p>${data.id}</p>
                <p>${date[0]}</p>
            <div>
                <a class="update" href="/admin.html#${data.id}">
                    <i class="far fa-edit"></i> Засах
                </a>
                <div class="delete" id="delete">
                    <i class="far fa-trash-alt"></i> Устгах
                </div>
                <div class="photo" id="photo" >
                    <i class="far fa-image"></i> Зураг
                </div>
            </div>
        </div>
        `;
  document.getElementById("table").insertAdjacentHTML("beforeend", html);
};

const blogsControl = async () => {
  state.blogs = await fetchBlogs();

  renderBlogs(state.blogs.data);
};

// --------------------------------------------------------

const fetchBlog = async (id) => {
  try {
    let result = await axios.get("http://127.0.0.1:8000/api/v1/blog/" + id);

    result = result.data;

    return result;
  } catch (error) {
    console.log(error);
  }
};

const renderBlogDetail = (data) => {
  document.getElementById("content").innerHTML = "";

  const date = data.createdAt.split("T");
  const time = date[1].split(".");

  const html = `
    <div class="admin-container">
    <div class="edit">
      <div class="edit__image">
        <p>Одоо байгаа зураг:</p>
        <img src="http://localhost:8000/api/v1/blog/photo/${data.photo}" />
      </div>
      <div class="edit__items">
        <p>Блогны гарчиг:</p>
        <input
            id="edit-title"
          type="text"
          value="${data.title}"
        />
        <p>Блог:</p>
        <textarea id="edit-body">
            ${data.body}
        </textarea>
        <div class="edit__button" id="edit-button">
            Хадгалах
        </div>
      </div>
    </div>
  </div>
        `;
  document.getElementById("content").insertAdjacentHTML("beforeend", html);
};

const blogEdit = async () => {
  const hash = location.hash.split("#")[1];
  state.blog = await fetchBlog(hash);

  renderBlogDetail(state.blog.data);
  document
    .getElementById("content")
    .addEventListener("click", async (event) => {
      if (event.target.id === "edit-button") {
        const title = document.getElementById("edit-title").value;
        const body = document.getElementById("edit-body").value;
        const img = document.getElementById("edit-img");

        try {
          const data = {
            title,
            body,
          };

          await axios.put("http://localhost:8000/api/v1/blog/" + hash, data);
          window.location.replace("http://localhost:3000/admin.html");
        } catch (error) {
          console.log(error);
        }
      }
    });
};

blogEdit();

window.addEventListener("hashchange", async () => {
  blogEdit();
});

// -----------------------------------------------

const fetchUsers = async () => {
  try {
    let result = await axios.get("http://127.0.0.1:8000/api/v1/user");

    result = result.data;

    return result;
  } catch (error) {
    console.log(error);
  }
};
const renderUsers = (data) => {
  data.forEach(renderUser);
};

const renderUser = (data) => {
  const date = data.createdAt.split("T");
  const html = `
        <div class="table" id=${data.id}>
            <p>
                <img
                src="http://127.0.0.1:8000/api/v1/blog/photo/${data.picture}"
                />
            </p>
            <p>${data.lastname}</p>
            <p>${data.firstname}</p>
            <p>${data.username}</p>
            <p>${data.id}</p>
            <p>${date[0]}</p>
            <div>
                <a class="update" href="/admin-user.html#${data.id}">
                    <i class="far fa-edit"></i> Засах
                </a>
                <div class="delete" id="delete">
                    <i class="far fa-trash-alt"></i> Устгах
                </div>
            </div>
        </div>
          `;
  document.querySelector(".users-table").insertAdjacentHTML("beforeend", html);
};

const usersControl = async () => {
  state.users = await fetchUsers();

  renderUsers(state.users.data);
};

// -----------------------------------------------

if (location.pathname === "/admin.html") {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("http://localhost:3000/");
  }
  document.getElementById("blogs").classList.add("active");
  blogsControl();
  fetchBlogs().then(result => {
    const html =`<p>Нийт блогийн тоо: ${result.count}</p>`
    document.getElementById("blogs-content").insertAdjacentHTML("afterbegin", html)
  })
  const renderPhoto = (id) => {
    const content = document.getElementById("content")
    content.innerHTML = ""
    const html = `
    <div class="admin-container">
      <form
        action="http://localhost:8000/api/v1/blog/${id}/photo"
        method="post"
        enctype="multipart/form-data"
        onsubmit="formSubmit()"
      >
        <p>Зураг оруулах</p>
        <input type="file" name="photo" />
        <input type="submit" value="upload"/>
      </form>
    </div>
    `
    content.insertAdjacentHTML("beforeend", html)
  }
  
  
  document
    .getElementById("content")
    .addEventListener("click", async (event) => {
      if (event.target.id === "delete") {
        const id = event.target.parentNode.parentNode.id;
        if (id) {
          try {
            const result = await axios.delete(
              "http://127.0.0.1:8000/api/v1/blog/" + id
            );
            window.location.replace("http://localhost:3000/admin.html");
            console.log(result);
          } catch (error) {
            console.log(error);
          }
        }
      } else if (event.target.id === "photo") {
        const id = event.target.parentNode.parentNode.id
        if (id) {
          try {
            renderPhoto(id)
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
} else if (location.pathname === "/admin-user.html") {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("http://localhost:3000/");
  }
  document.getElementById("users").classList.add("active");
  usersControl();

  fetchUsers().then(result => {
    const html =`<p>Нийт хэрэглэгчийн тоо: ${state.users.count}</p>`
    document.getElementById("users-content").insertAdjacentHTML("afterbegin", html)
  })
  document
    .getElementById("content")
    .addEventListener("click", async (event) => {
      if (event.target.id === "delete") {
        const id = event.target.parentNode.parentNode.id;
        if (id) {
          try {
            const result = await axios.delete(
              "http://127.0.0.1:8000/api/v1/user/" + id
            );
            console.log(result);
            window.location.replace("http://localhost:3000/admin-user.html");
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
}

// --------------------------------------------------------

const fetchUser = async (id) => {
  try {
    let result = await axios.get("http://127.0.0.1:8000/api/v1/user/" + id);

    result = result.data;

    return result;
  } catch (error) {
    console.log(error);
  }
};

const renderUserDetail = (data) => {
  document.getElementById("content").innerHTML = "";

  const date = data.createdAt.split("T");
  const time = date[1].split(".");

  const html = `
      <div class="admin-container">
      <div class="edit">
        <div class="edit__items">
          <p>Овог:</p>
          <input
            type="text"
            id="edit-lastname"
            value="${data.lastname}"
          />
          <p>Нэр:</p>
          <input
            type="text"
            id="edit-firstname"
            value="${data.firstname}"
          />
          <p>Нэвтрэх нэр:</p>
          <input
            type="text"
            id="edit-username"
            value="${data.username}"
          />
          <div class="edit__button" id="ed-button">
              Хадгалах
          </div>
        </div>
      </div>
    </div>
          `;
  document.getElementById("content").insertAdjacentHTML("beforeend", html);
};

const userEdit = async () => {
  const hash = location.hash.split("#")[1];
  state.user = await fetchUser(hash);

  renderUserDetail(state.user.data);
  document
    .getElementById("content")
    .addEventListener("click", async (event) => {
      if (event.target.id === "ed-button") {
        const lastname = document.getElementById("edit-lastname").value;
        const firstname = document.getElementById("edit-firstname").value;
        const username = document.getElementById("edit-username").value;

        try {
          const data = {
            lastname,
            firstname,
            username,
          };

          await axios.put("http://localhost:8000/api/v1/user/" + hash, data);
          window.location.replace("http://localhost:3000/admin-user.html");
        } catch (error) {
          console.log(error);
        }
      }
    });
};

userEdit();

window.addEventListener("hashchange", async () => {
  userEdit();
});

// ------------------------------------------------------

if (location.pathname === "/new-user.html") {
  document
    .getElementById("user-send")
    .addEventListener("click", async (event) => {
      const lastname = document.getElementById("new-lastname").value;
      const firstname = document.getElementById("new-firstname").value;
      const username = document.getElementById("new-username").value;
      const password = document.getElementById("new-password").value;

      try {
        const data = {
          lastname,
          firstname,
          username,
          password,
        };
        await axios.post("http://localhost:8000/api/v1/register", data);
        window.location.replace("http://localhost:3000/admin-user.html");
      } catch (err) {
        console.log(err);
      }
    });
}
if (location.pathname === "/new-blog.html") {
  document
    .getElementById("blog-send")
    .addEventListener("click", async (event) => {
      const title = document.getElementById("new-title").value;
      const body = document.getElementById("new-body").value;

      try {
        const data = {
          title,
          body,
        };
        await axios.post("http://localhost:8000/api/v1/blog", data);
        window.location.replace("http://localhost:3000/admin.html");
      } catch (err) {
        console.log(err);
      }
    });
}
