 state = {};

const fetchBlogs = async () => {
  try {
    let result = await axios.get("http://127.0.0.1:8000/api/v1/blog");

    result = result.data;

    return result;
  } catch (error) {
    console.log(error);
  }
};

const renderBlog = (data) => {
  const date = data.createdAt.split("T");
  const html = `
        <div>
            <img src="http://localhost:8000/api/v1/blog/photo/${data.photo}">
            <p>${data.title}</p>
            <h6>${date[0]}</h6>
            <a class="section__button" href="blog.html#${data.id}">Дэлгэрэнгүй унших</a>
        </div>
      `;
  document.querySelector(".blog-js").insertAdjacentHTML("beforeend", html);
};

const renderBlogs = (data) => {
  data.forEach(renderBlog);
};

const blogsControl = async () => {
  state.blogs = await fetchBlogs();

  renderBlogs(state.blogs.data);
};
const indexControl = async () => {
  state.blogs = await fetchBlogs();

  renderBlogs(state.blogs.data);
};

// --------------------------------------------------------------------

const fetchBlogDetail = async (id) => {
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

  const html = `
    <div class="detail">
      <div class="container">
        <h3>${data.title}</h3>
        <div class="detail__items">
        <div class="detail__image">
          <img
            src="http://localhost:8000/api/v1/blog/photo/${data.photo}"
            alt=""
          />
          <div>
            <i class="fas fa-clock"></i>
            <h5>${date[0]}</h5>
          </div>
        </div>
          <p>
            ${data.body}
          </p>
        </div>
      </div>
    </div>
      `;
  document.getElementById("content").insertAdjacentHTML("beforeend", html);
};

const blogDetail = async () => {
  const hash = location.hash.split("#")[1];
  state.blog = await fetchBlogDetail(hash);

  renderBlogDetail(state.blog.data);
};

blogDetail();

window.addEventListener("hashchange", async () => {
  const hash = location.hash.split("#")[1];
  state.blog = await fetchBlogDetail(hash);

  renderBlogDetail(state.blog.data);
});

// --------------------------------------------------------------------

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
    <div class="about__content">
      <img
        src="http://localhost:8000/api/v1/blog/photo/${data.picture}"
      />
      <div class="about__item">
        <p>Овог: ${data.lastname}</p>
        <p>Нэр: ${data.firstname}</p>
      </div>
      <div class="about__item">
        <p>Нэгдсэн огноо: ${date[0]}</p>
        <p>ID: ${data.id}</p>
      </div>
    </div>
      `;
  document.querySelector(".about").insertAdjacentHTML("beforeend", html);
};

const userControl = async () => {
  state.users = await fetchUsers();

  renderUsers(state.users.data);
};

if (location.pathname === "/blog.html") {
  document.getElementById("navbar-blog").classList.add("navbar--open");
  blogsControl();
} else if (location.pathname === "/index.html" || location.pathname === "/") {
  document.getElementById("navbar-home").classList.add("navbar--open");
  indexControl();
} else if (location.pathname === "/about.html") {
  document.getElementById("navbar-about").classList.add("navbar--open");
  userControl();
}

// --------------------------------------------------------------------

const renderSearchs = (data) => {
  document.getElementById("content").innerHTML = "";
  const html = `
  <section class="section">
    <div class="container">
      <p>Хайлтын хариу</p>
      <div class="section__items blog-js"></div>
    </div>
  </section>`;
  document.getElementById("content").insertAdjacentHTML("beforeend", html);
  data.forEach(renderSearch);
};
const renderSearch = (data) => {
  const date = data.createdAt.split("T");

  const html = `
            <div>
              <img src="http://localhost:8000/api/v1/blog/photo/${data.photo}">
              <p>${data.title}</p>
              <h6>${date[0]}</h6>
              <a class="section__button" href="blog.html#${data.id}">Дэлгэрэнгүй унших</a>
            </div>
      `;

  document.querySelector(".blog-js").insertAdjacentHTML("beforeend", html);
};

const searchResults = (value) => {
  let miniSearch = new MiniSearch({
    fields: ["title", "createdAt"], // fields to index for full-text search
    storeFields: ["title", "createdAt", "photo", "id"], // fields to return with search results
  });

  miniSearch.addAll(state.blogs.data);

  let results = miniSearch.search(value);

  renderSearchs(results);
};

document.getElementById("search-button").addEventListener("click", () => {
  const search = document.getElementById("search-input").value;

  searchResults(search);
});
