$(function () {
  // your code here
  const previous = $(".container header button:first");
  const next = $(".container header button:last");
  const infoContent = $(".info__content");
  const infoImage = $(".info__image");
  const postsClass = $(".posts");
  const todosClass = $(".todos");
  const postId = postsClass.find("h4").attr("id");
  // const li = $("<li>");
  let id = 1;

  function getUserById(userid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}`,
        type: "GET",
        success: function (res) {
          resolve(res);
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  }

  function getPostsById(userid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}/posts`,
        type: "GET",
        success: function (res) {
          const postsResData = res.posts;
          resolve(postsResData);
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  }

  function getTodosById(userid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/users/${userid}/todos`,
        type: "GET",
        success: function (res) {
          const todosResData = res.todos;
          resolve(todosResData);
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  }

  function getPostsByPostId(postid) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/posts/${postid}`,
        type: "GET",
        success: function (res) {
          resolve(res);
          // console.log(res);
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  }

  function buildHTML(user, posts, todos) {
    infoImage.find("img").attr("src", `${user.image}`);
    infoContent.html(`
      <h2>${user.firstName} ${user.lastName}</h2>
      <div><strong>Age</strong>: ${user.age}</div>
      <div><strong>Email</strong>: ${user.email}</div>
      <div><strong>Phone</strong>: ${user.phone}</div>
    `);

    postsClass.find("h3").text(`${user.firstName}'s Posts`);

    postsClass.find("ul").html("");

    if (posts.length >= 1) {
      for (const [i, el] of posts.entries()) {
        postsClass.find("ul").append(`
        <li>
          <h4 id=${el.id}>${el.title}</h4>
          <p>${el.body}</p>
        </li>
        `);
      }
    } else {
      postsClass.find("ul").append(`
          <li>
            <p>User has no posts</p>
          </li>
          `);
    }

    postsClass.find("h4").on("click", async function () {
      const postIdData = await $(this).attr("id");
      const modalData = await getPostsByPostId(postIdData);
      console.log(modalData);
      $("main").append(`
        <div class="overlay">
          <div class="modal">
            <h4>${modalData.title}</h4>
            <p>${modalData.body}</p>
            <p><em>Views</em>: ${modalData.views}</p>
            <button>Close Modal</button>
          </div>
        </div>
      `);

      const closeBtn = $(".modal").find("button");
      closeBtn.on("click", function () {
        $(".overlay").remove();
      });
    });

    // postsClass.find("h3").on("click", function () {
    //   $("ul").slideToggle();
    // });

    todosClass.find("h3").text(`${user.firstName}'s To Dos`);

    const newArr = todos.map((todo) => todo.todo);

    todosClass.find("ul").html("");

    if (todos.length >= 1) {
      newArr.forEach((el) => {
        let li = $("<li>");
        li.text(el);
        todosClass.find("ul").append(li);
      });
    } else {
      todosClass.find("ul").append(`
        <li>
          <p>User has no posts</p>
        </li>
        `);
    }

    todosClass.find("h3").on("click", function () {
      $(this).next().slideToggle();
    });
  }

  async function build(id = 1) {
    const user = await getUserById(id);
    const posts = await getPostsById(id);
    const todos = await getTodosById(id);
    // const postsId = await getPostsByPostId(id);
    buildHTML(user, posts, todos);
    // console.log(user);
    // console.log(posts);
    // console.log(todos);
  }

  next.on("click", function () {
    if (id > 0 && id < 30) {
      id++;
      // console.log(id);
    } else if (id === 30) {
      id = 1;
      // console.log(id);
    }
    return build(id);
  });

  previous.on("click", function () {
    if (id >= 2 && id <= 30) {
      id--;
      // console.log(id);
    } else if (id === 1) {
      id = 30;
      // console.log(id);
    }
    return build(id);
  });

  build();
});
