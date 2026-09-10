(function () {
  "use strict";

  /* =========================================================
     STORAGE KEYS
  ========================================================= */

  const KEY_BOOKS = "britech_library_books_v2";
  const KEY_STUDENTS = "britech_library_students_v1";
  const KEY_TX = "britech_library_transactions_v1";
  const KEY_PROFILE = "britech_library_profile_v1";
  const KEY_PREF = "britech_library_prefs_v1";

  /* =========================================================
     DEFAULT DATA
  ========================================================= */

  const defaultBooks = [
    {
      id: "B001",
      title: "Introduction to Programming",
      author: "John Smith",
      category: "Programming",
      isbn: "978000000001",
      quantity: 5,
      available: 4,
      status: "Available",
    },
    {
      id: "B002",
      title: "Database Management Systems",
      author: "James Brown",
      category: "Database",
      isbn: "978000000002",
      quantity: 4,
      available: 2,
      status: "Available",
    },
    {
      id: "B003",
      title: "Object-Oriented Programming",
      author: "Robert Martin",
      category: "Programming",
      isbn: "978000000003",
      quantity: 3,
      available: 3,
      status: "Available",
    },
    {
      id: "B004",
      title: "Web Development Basics",
      author: "Michael Lee",
      category: "Web Development",
      isbn: "978000000004",
      quantity: 6,
      available: 5,
      status: "Available",
    },
    {
      id: "B005",
      title: "Computer Networks",
      author: "David Wilson",
      category: "Networking",
      isbn: "978000000005",
      quantity: 4,
      available: 4,
      status: "Available",
    },
  ];

  const defaultStudents = [
    {
      id: "2024001",
      grade_section_id: "GS001",
      account_id: "ACC001",
      lastname: "Dela Cruz",
      firstname: "Juan",
      middlename: "",
      contact_no: "09171234567",
      created_at: "2026-09-01T08:00:00",
      updated_at: "2026-09-01T08:00:00",
    },
    {
      id: "2024002",
      grade_section_id: "GS002",
      account_id: "ACC002",
      lastname: "Santos",
      firstname: "Maria",
      middlename: "",
      contact_no: "09181234567",
      created_at: "2026-09-01T08:30:00",
      updated_at: "2026-09-01T08:30:00",
    },
    {
      id: "2024003",
      grade_section_id: "GS001",
      account_id: "ACC003",
      lastname: "Garcia",
      firstname: "Pedro",
      middlename: "",
      contact_no: "09191234567",
      created_at: "2026-09-02T09:00:00",
      updated_at: "2026-09-02T09:00:00",
    },
    {
      id: "2024004",
      grade_section_id: "GS003",
      account_id: "ACC004",
      lastname: "Reyes",
      firstname: "Ana",
      middlename: "",
      contact_no: "09201234567",
      created_at: "2026-09-02T09:30:00",
      updated_at: "2026-09-02T09:30:00",
    },
    {
      id: "2024005",
      grade_section_id: "GS001",
      account_id: "ACC005",
      lastname: "Villanueva",
      firstname: "Mark",
      middlename: "",
      contact_no: "09211234567",
      created_at: "2026-09-03T10:00:00",
      updated_at: "2026-09-03T10:00:00",
    },
  ];

  const defaultTransactions = [];

  /* =========================================================
     STORAGE FUNCTIONS
  ========================================================= */

  function get(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);

      if (stored === null) {
        return defaultValue;
      }

      const value = JSON.parse(stored);

      return value;
    } catch (error) {
      console.error("Storage read error:", error);
      return defaultValue;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      return true;
    } catch (error) {
      console.error("Storage save error:", error);

      toast("Unable to save data.");

      return false;
    }
  }

  /* =========================================================
     INITIAL STORAGE
  ========================================================= */

  if (!localStorage.getItem(KEY_BOOKS)) {
    set(KEY_BOOKS, defaultBooks);
  }

  if (!localStorage.getItem(KEY_STUDENTS)) {
    set(KEY_STUDENTS, defaultStudents);
  }

  if (!localStorage.getItem(KEY_TX)) {
    set(KEY_TX, defaultTransactions);
  }

  /* =========================================================
     DATA ACCESS
  ========================================================= */

  function books() {
    const data = get(KEY_BOOKS, defaultBooks);

    return Array.isArray(data) ? data : [];
  }

  function students() {
    const data = get(KEY_STUDENTS, defaultStudents);

    return Array.isArray(data) ? data : [];
  }

  function transactions() {
    const data = get(KEY_TX, defaultTransactions);

    return Array.isArray(data) ? data : [];
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  function esc(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function studentFullName(student) {
    return [student.firstname, student.middlename, student.lastname].filter(Boolean).join(" ");
  }

  function formatDateTime(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  function toast(message) {
    const oldToast = document.querySelector(".app-toast");

    if (oldToast) {
      oldToast.remove();
    }

    const element = document.createElement("div");

    element.className = "app-toast";

    element.textContent = message;

    Object.assign(element.style, {
      position: "fixed",
      right: "24px",
      bottom: "24px",
      zIndex: "99999",
      padding: "14px 20px",
      background: "#1f2937",
      color: "#fff",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      boxShadow: "0 8px 25px rgba(0,0,0,.2)",
    });

    document.body.appendChild(element);

    setTimeout(function () {
      if (element) {
        element.remove();
      }
    }, 2500);
  }

  /* =========================================================
     MODAL
  ========================================================= */

  function modal(title, html, onSave) {
    const backdrop = document.createElement("div");

    backdrop.className = "app-modal-backdrop";

    Object.assign(backdrop.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "9999",
      padding: "20px",
    });

    backdrop.innerHTML = `
      <div
        class="app-modal"
        style="
          width:100%;
          max-width:720px;
          max-height:90vh;
          overflow:auto;
          background:#fff;
          border-radius:12px;
          box-shadow:0 20px 50px rgba(0,0,0,.25);
        "
      >

        <div
          style="
            padding:20px 24px;
            border-bottom:1px solid #eee;
            display:flex;
            justify-content:space-between;
            align-items:center;
          "
        >

          <h2
            style="
              margin:0;
              font-size:20px;
              font-weight:700;
            "
          >
            ${esc(title)}
          </h2>

          <button
            type="button"
            class="modal-close"
            style="
              border:0;
              background:none;
              font-size:22px;
              cursor:pointer;
            "
          >
            &times;
          </button>

        </div>


        <div style="padding:24px;">
          ${html}
        </div>


        <div
          style="
            padding:16px 24px;
            border-top:1px solid #eee;
            display:flex;
            justify-content:flex-end;
            gap:10px;
          "
        >

          <button
            type="button"
            class="modal-cancel"
            style="
              padding:10px 18px;
              border:1px solid #ddd;
              background:#fff;
              border-radius:7px;
              cursor:pointer;
            "
          >
            Cancel
          </button>


          <button
            type="button"
            class="modal-save"
            style="
              padding:10px 18px;
              border:0;
              background:#2563eb;
              color:#fff;
              border-radius:7px;
              cursor:pointer;
            "
          >
            Save
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(backdrop);

    backdrop.querySelector(".modal-close").addEventListener("click", function () {
      backdrop.remove();
    });

    backdrop.querySelector(".modal-cancel").addEventListener("click", function () {
      backdrop.remove();
    });

    backdrop.querySelector(".modal-save").addEventListener("click", function () {
      onSave(backdrop);
    });

    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) {
        backdrop.remove();
      }
    });

    return backdrop;
  }

  /* =========================================================
     PAGINATION
  ========================================================= */

  function paginate(table, perPage, startPage) {
    if (!table) {
      return;
    }

    if (!perPage) {
      perPage = 2;
    }

    if (!startPage) {
      startPage = 1;
    }

    const tbody = table.tBodies[0];

    if (!tbody) {
      return;
    }

    const rows = Array.from(tbody.querySelectorAll("tr"));

    const parentOne = table.parentElement;

    const parentTwo = parentOne ? parentOne.parentElement : null;

    let pagination = null;

    if (parentTwo) {
      pagination = parentTwo.querySelector(".pagination");
    }

    if (!pagination) {
      pagination = document.querySelector(".pagination");
    }

    if (!pagination) {
      rows.forEach(function (row) {
        row.style.display = "";
      });

      return;
    }

    const totalPages = Math.max(1, Math.ceil(rows.length / perPage));

    let currentPage = Math.min(Math.max(startPage, 1), totalPages);

    function renderPagination() {
      rows.forEach(function (row, index) {
        const first = (currentPage - 1) * perPage;

        const last = first + perPage;

        if (index >= first && index < last) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });

      pagination.innerHTML = "";

      /* PREVIOUS */

      const previous = document.createElement("button");

      previous.className = "page-btn";

      previous.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

      previous.disabled = currentPage === 1;

      previous.addEventListener("click", function () {
        if (currentPage > 1) {
          currentPage--;
          renderPagination();
        }
      });

      pagination.appendChild(previous);

      /* NUMBER BUTTONS */

      for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");

        button.className = "page-btn";

        button.textContent = page;

        if (page === currentPage) {
          button.classList.add("active");
        }

        button.addEventListener("click", function () {
          currentPage = page;

          renderPagination();
        });

        pagination.appendChild(button);
      }

      /* NEXT */

      const next = document.createElement("button");

      next.className = "page-btn";

      next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

      next.disabled = currentPage === totalPages;

      next.addEventListener("click", function () {
        if (currentPage < totalPages) {
          currentPage++;
          renderPagination();
        }
      });

      pagination.appendChild(next);
    }

    renderPagination();
  }

  /* =========================================================
     BOOKS PAGE
  ========================================================= */

  function pageBooks() {
    const table = document.querySelector(".data-table");

    if (!table) {
      return;
    }

    const tbody = table.tBodies[0];

    if (!tbody) {
      return;
    }

    function render(list) {
      if (!list) {
        list = books();
      }

      tbody.innerHTML = list
        .map(function (book) {
          return `
            <tr data-id="${esc(book.id)}">

              <td>${esc(book.id)}</td>

              <td>${esc(book.title)}</td>

              <td>${esc(book.author)}</td>

              <td>${esc(book.category)}</td>

              <td>${esc(book.isbn)}</td>

              <td>${esc(book.quantity)}</td>

              <td>${esc(book.available)}</td>

              <td>${esc(book.status)}</td>

              <td>

                <button
                  class="action-btn edit-book"
                  data-id="${esc(book.id)}"
                  title="Edit"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>


                <button
                  class="action-btn delete-book"
                  data-id="${esc(book.id)}"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>

              </td>

            </tr>
          `;
        })
        .join("");

      wireBooks();

      paginate(table, 2, 1);
    }

    function wireBooks() {
      document.querySelectorAll(".edit-book").forEach(function (button) {
        button.onclick = function () {
          const id = button.dataset.id;

          const book = books().find(function (item) {
            return item.id === id;
          });

          if (!book) {
            return;
          }

          modal(
            "Edit Book",
            `
                  <div
                    style="
                      display:grid;
                      gap:14px;
                    "
                  >

                    <label>
                      Book ID
                      <input
                        id="book-id"
                        value="${esc(book.id)}"
                        readonly
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>


                    <label>
                      Title
                      <input
                        id="book-title"
                        value="${esc(book.title)}"
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>


                    <label>
                      Author
                      <input
                        id="book-author"
                        value="${esc(book.author)}"
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>


                    <label>
                      Category
                      <input
                        id="book-category"
                        value="${esc(book.category)}"
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>


                    <label>
                      ISBN
                      <input
                        id="book-isbn"
                        value="${esc(book.isbn)}"
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>


                    <label>
                      Quantity
                      <input
                        id="book-quantity"
                        type="number"
                        min="0"
                        value="${esc(book.quantity)}"
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>


                    <label>
                      Available
                      <input
                        id="book-available"
                        type="number"
                        min="0"
                        value="${esc(book.available)}"
                        style="
                          width:100%;
                          padding:10px;
                          box-sizing:border-box;
                        "
                      />
                    </label>

                  </div>
                `,
            function (backdrop) {
              const updatedBooks = books();

              const index = updatedBooks.findIndex(function (item) {
                return item.id === id;
              });

              if (index === -1) {
                return;
              }

              const title = backdrop.querySelector("#book-title").value.trim();

              const author = backdrop.querySelector("#book-author").value.trim();

              const category = backdrop.querySelector("#book-category").value.trim();

              const isbn = backdrop.querySelector("#book-isbn").value.trim();

              const quantity = Number(backdrop.querySelector("#book-quantity").value);

              const available = Number(backdrop.querySelector("#book-available").value);

              if (!title || !author || !category || !isbn) {
                toast("Please complete all required fields.");

                return;
              }

              if (quantity < 0 || available < 0 || available > quantity) {
                toast("Please check quantity and available.");

                return;
              }

              updatedBooks[index] = {
                id: updatedBooks[index].id,
                title: title,
                author: author,
                category: category,
                isbn: isbn,
                quantity: quantity,
                available: available,
                status: available > 0 ? "Available" : "Unavailable",
              };

              if (set(KEY_BOOKS, updatedBooks)) {
                backdrop.remove();

                render();

                toast("Book updated.");
              }
            },
          );
        };
      });

      document.querySelectorAll(".delete-book").forEach(function (button) {
        button.onclick = function () {
          const id = button.dataset.id;

          if (!confirm("Delete this book?")) {
            return;
          }

          const updatedBooks = books().filter(function (book) {
            return book.id !== id;
          });

          if (set(KEY_BOOKS, updatedBooks)) {
            render();

            toast("Book deleted.");
          }
        };
      });
    }

    const addLinks = Array.from(document.querySelectorAll("a"));

    const add = addLinks.find(function (link) {
      return link.textContent.trim().includes("Add Book");
    });

    if (add) {
      add.onclick = function (event) {
        event.preventDefault();

        modal(
          "Add Book",
          `
              <div
                style="
                  display:grid;
                  gap:14px;
                "
              >

                <label>
                  Book ID *
                  <input
                    id="book-id"
                    placeholder="B006"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>


                <label>
                  Title *
                  <input
                    id="book-title"
                    placeholder="Book title"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>


                <label>
                  Author *
                  <input
                    id="book-author"
                    placeholder="Author"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>


                <label>
                  Category *
                  <input
                    id="book-category"
                    placeholder="Programming"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>


                <label>
                  ISBN *
                  <input
                    id="book-isbn"
                    placeholder="978000000006"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>


                <label>
                  Quantity *
                  <input
                    id="book-quantity"
                    type="number"
                    min="0"
                    value="1"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>


                <label>
                  Available *
                  <input
                    id="book-available"
                    type="number"
                    min="0"
                    value="1"
                    style="
                      width:100%;
                      padding:10px;
                      box-sizing:border-box;
                    "
                  />
                </label>

              </div>
            `,
          function (backdrop) {
            const id = backdrop.querySelector("#book-id").value.trim();

            const title = backdrop.querySelector("#book-title").value.trim();

            const author = backdrop.querySelector("#book-author").value.trim();

            const category = backdrop.querySelector("#book-category").value.trim();

            const isbn = backdrop.querySelector("#book-isbn").value.trim();

            const quantity = Number(backdrop.querySelector("#book-quantity").value);

            const available = Number(backdrop.querySelector("#book-available").value);

            if (!id || !title || !author || !category || !isbn) {
              toast("Please complete all required fields.");

              return;
            }

            if (quantity < 0 || available < 0 || available > quantity) {
              toast("Please check quantity and available.");

              return;
            }

            const currentBooks = books();

            const duplicate = currentBooks.some(function (book) {
              return book.id === id;
            });

            if (duplicate) {
              toast("Book ID already exists.");

              return;
            }

            currentBooks.push({
              id: id,
              title: title,
              author: author,
              category: category,
              isbn: isbn,
              quantity: quantity,
              available: available,
              status: available > 0 ? "Available" : "Unavailable",
            });

            if (set(KEY_BOOKS, currentBooks)) {
              backdrop.remove();

              render();

              toast("Book added.");
            }
          },
        );
      };
    }

    render();
  }

  /* =========================================================
     STUDENTS PAGE
  ========================================================= */

  function pageStudents() {
    const table = document.querySelector(".data-table");

    if (!table) {
      console.error("Students table not found.");

      return;
    }

    const tbody = table.tBodies[0];

    if (!tbody) {
      console.error("Students table body not found.");

      return;
    }

    function render(list, startPage) {
      if (!list) {
        list = students();
      }

      if (!startPage) {
        startPage = 1;
      }

      tbody.innerHTML = list
        .map(function (student) {
          return `
            <tr data-id="${esc(student.id)}">

              <td>
                ${esc(student.id)}
              </td>

              <td>
                ${esc(student.grade_section_id)}
              </td>

              <td>
                ${esc(student.account_id)}
              </td>

              <td>
                ${esc(student.lastname)}
              </td>

              <td>
                ${esc(student.firstname)}
              </td>

              <td>
                ${esc(student.middlename)}
              </td>

              <td>
                ${esc(student.contact_no)}
              </td>

              <td>
                ${esc(formatDateTime(student.created_at))}
              </td>

              <td>
                ${esc(formatDateTime(student.updated_at))}
              </td>

              <td>

                <button
                  class="action-btn view-student"
                  data-id="${esc(student.id)}"
                  title="View"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>


                <button
                  class="action-btn edit-student"
                  data-id="${esc(student.id)}"
                  title="Edit"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>


                <button
                  class="action-btn delete-student"
                  data-id="${esc(student.id)}"
                  title="Delete"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>

              </td>

            </tr>
          `;
        })
        .join("");

      wireStudents();

      paginate(table, 2, startPage);
    }

    function wireStudents() {
      /* =====================================================
         VIEW STUDENT
      ===================================================== */

      document.querySelectorAll(".view-student").forEach(function (button) {
        button.onclick = function () {
          const id = button.dataset.id;

          const student = students().find(function (item) {
            return String(item.id) === String(id);
          });

          if (!student) {
            toast("Student not found.");

            return;
          }

          const backdrop = modal(
            "Student Details",
            `
                    <div
                      style="
                        display:grid;
                        gap:12px;
                      "
                    >

                      <div>
                        <strong>ID:</strong>
                        ${esc(student.id)}
                      </div>

                      <div>
                        <strong>
                          Grade Section ID:
                        </strong>
                        ${esc(student.grade_section_id)}
                      </div>

                      <div>
                        <strong>
                          Account ID:
                        </strong>
                        ${esc(student.account_id)}
                      </div>

                      <div>
                        <strong>
                          Last Name:
                        </strong>
                        ${esc(student.lastname)}
                      </div>

                      <div>
                        <strong>
                          First Name:
                        </strong>
                        ${esc(student.firstname)}
                      </div>

                      <div>
                        <strong>
                          Middle Name:
                        </strong>
                        ${esc(student.middlename)}
                      </div>

                      <div>
                        <strong>
                          Contact No.:
                        </strong>
                        ${esc(student.contact_no)}
                      </div>

                      <div>
                        <strong>
                          Created At:
                        </strong>
                        ${esc(formatDateTime(student.created_at))}
                      </div>

                      <div>
                        <strong>
                          Updated At:
                        </strong>
                        ${esc(formatDateTime(student.updated_at))}
                      </div>

                    </div>
                  `,
            function (backdrop) {
              backdrop.remove();
            },
          );

          const saveButton = backdrop.querySelector(".modal-save");

          if (saveButton) {
            saveButton.textContent = "Close";
          }
        };
      });

      /* =====================================================
         EDIT STUDENT
      ===================================================== */

      document.querySelectorAll(".edit-student").forEach(function (button) {
        button.onclick = function () {
          const id = button.dataset.id;

          const student = students().find(function (item) {
            return String(item.id) === String(id);
          });

          if (!student) {
            toast("Student not found.");

            return;
          }

          studentModal("Edit Student", student, student.id);
        };
      });

      /* =====================================================
         DELETE STUDENT
      ===================================================== */

      document.querySelectorAll(".delete-student").forEach(function (button) {
        button.onclick = function () {
          const id = button.dataset.id;

          const student = students().find(function (item) {
            return String(item.id) === String(id);
          });

          if (!student) {
            toast("Student not found.");

            return;
          }

          const confirmed = confirm("Are you sure you want to delete " + studentFullName(student) + "?");

          if (!confirmed) {
            return;
          }

          const updatedStudents = students().filter(function (item) {
            return String(item.id) !== String(id);
          });

          if (set(KEY_STUDENTS, updatedStudents)) {
            render(updatedStudents, 1);

            toast("Student deleted.");
          }
        };
      });
    }

    /* =====================================================
       STUDENT MODAL
    ===================================================== */

    function studentModal(title, student, oldId) {
      if (!student) {
        student = {};
      }

      if (oldId === undefined) {
        oldId = null;
      }

      const now = new Date().toISOString();

      const createdAt = student.created_at || now;

      modal(
        title,
        `
          <div
            style="
              display:grid;
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
              gap:16px;
            "
          >

            <label>
              ID *
              <input
                id="f-id"
                type="text"
                value="${esc(student.id || "")}"
                placeholder="2024006"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>


            <label>
              Grade Section ID *
              <input
                id="f-grade-section-id"
                type="text"
                value="${esc(student.grade_section_id || "")}"
                placeholder="GS001"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>


            <label>
              Account ID *
              <input
                id="f-account-id"
                type="text"
                value="${esc(student.account_id || "")}"
                placeholder="ACC006"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>


            <label>
              Last Name *
              <input
                id="f-lastname"
                type="text"
                value="${esc(student.lastname || "")}"
                placeholder="Dela Cruz"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>


            <label>
              First Name *
              <input
                id="f-firstname"
                type="text"
                value="${esc(student.firstname || "")}"
                placeholder="Juan"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>


            <label>
              Middle Name
              <input
                id="f-middlename"
                type="text"
                value="${esc(student.middlename || "")}"
                placeholder="Middle name"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>


            <label
              style="
                grid-column:1 / -1;
              "
            >
              Contact No. *
              <input
                id="f-contact-no"
                type="text"
                value="${esc(student.contact_no || "")}"
                placeholder="09123456789"
                maxlength="20"
                style="
                  width:100%;
                  padding:10px;
                  margin-top:5px;
                  box-sizing:border-box;
                "
              />
            </label>

          </div>
        `,
        function (backdrop) {
          /* =================================================
             GET VALUES
          ================================================= */

          const id = backdrop.querySelector("#f-id").value.trim();

          const gradeSectionId = backdrop.querySelector("#f-grade-section-id").value.trim();

          const accountId = backdrop.querySelector("#f-account-id").value.trim();

          const lastname = backdrop.querySelector("#f-lastname").value.trim();

          const firstname = backdrop.querySelector("#f-firstname").value.trim();

          const middlename = backdrop.querySelector("#f-middlename").value.trim();

          const contactNo = backdrop.querySelector("#f-contact-no").value.trim();

          /* =================================================
             VALIDATION
          ================================================= */

          if (!id || !gradeSectionId || !accountId || !lastname || !firstname || !contactNo) {
            toast("Please complete all required fields.");

            return;
          }

          /* =================================================
             CURRENT STUDENTS
          ================================================= */

          const currentStudents = students();

          /* =================================================
             DUPLICATE ID CHECK
          ================================================= */

          const duplicate = currentStudents.some(function (item) {
            if (oldId !== null) {
              return String(item.id) === String(id) && String(item.id) !== String(oldId);
            }

            return String(item.id) === String(id);
          });

          if (duplicate) {
            toast("Student ID already exists.");

            return;
          }

          /* =================================================
             STUDENT OBJECT
          ================================================= */

          const studentData = {
            id: id,

            grade_section_id: gradeSectionId,

            account_id: accountId,

            lastname: lastname,

            firstname: firstname,

            middlename: middlename,

            contact_no: contactNo,

            created_at: oldId !== null ? createdAt : now,

            updated_at: now,
          };

          /* =================================================
             ADD OR EDIT
          ================================================= */

          let updatedStudents;

          if (oldId !== null) {
            updatedStudents = currentStudents.map(function (item) {
              if (String(item.id) === String(oldId)) {
                return studentData;
              }

              return item;
            });
          } else {
            updatedStudents = [...currentStudents, studentData];
          }

          /* =================================================
             SAVE
          ================================================= */

          const saved = set(KEY_STUDENTS, updatedStudents);

          if (!saved) {
            toast("Student was not saved.");

            return;
          }

          /* =================================================
             CLOSE MODAL
          ================================================= */

          backdrop.remove();

          /* =================================================
             FIND NEW STUDENT PAGE
          ================================================= */

          const newIndex = updatedStudents.findIndex(function (item) {
            return String(item.id) === String(id);
          });

          const targetPage = Math.floor(newIndex / 2) + 1;

          render(updatedStudents, targetPage);

          /* =================================================
             SUCCESS
          ================================================= */

          if (oldId !== null) {
            toast("Student updated successfully.");
          } else {
            toast("Student added successfully.");
          }
        },
      );
    }

    /* =====================================================
       ADD STUDENT BUTTON
    ===================================================== */

    const addLinks = Array.from(document.querySelectorAll("a"));

    const add = addLinks.find(function (link) {
      return link.textContent.trim().includes("Add Student");
    });

    if (add) {
      add.onclick = function (event) {
        event.preventDefault();

        studentModal("Add Student");
      };
    }

    /* =====================================================
       SEARCH STUDENTS
    ===================================================== */

    const searchInput = document.querySelector('input[placeholder="Search students..."]');

    if (searchInput) {
      searchInput.oninput = function () {
        const keyword = searchInput.value.trim().toLowerCase();

        const filtered = students().filter(function (student) {
          return [
            student.id,
            student.grade_section_id,
            student.account_id,
            student.lastname,
            student.firstname,
            student.middlename,
            student.contact_no,
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword);
        });

        render(filtered, 1);
      };
    }

    /* =====================================================
       INITIAL STUDENT RENDER
    ===================================================== */

    render();
  }

  /* =========================================================
     BORROW / RETURN PAGE
  ========================================================= */

  function pageBorrowReturn() {
    const table = document.querySelector(".data-table");

    if (!table) {
      return;
    }

    const tbody = table.tBodies[0];

    if (!tbody) {
      return;
    }

    function render() {
      const allTransactions = transactions();

      tbody.innerHTML = allTransactions
        .map(function (item) {
          return `
              <tr>

                <td>
                  ${esc(item.id)}
                </td>

                <td>
                  ${esc(item.book_id)}
                </td>

                <td>
                  ${esc(item.student_id)}
                </td>

                <td>
                  ${esc(item.type)}
                </td>

                <td>
                  ${esc(formatDateTime(item.date))}
                </td>

                <td>
                  ${esc(item.status)}
                </td>

              </tr>
            `;
        })
        .join("");

      paginate(table, 5, 1);
    }

    const addLinks = Array.from(document.querySelectorAll("a"));

    const add = addLinks.find(function (link) {
      return link.textContent.trim().includes("Borrow Book");
    });

    if (add) {
      add.onclick = function (event) {
        event.preventDefault();

        const allBooks = books();

        const allStudents = students();

        const availableBooks = allBooks.filter(function (book) {
          return Number(book.available) > 0;
        });

        if (availableBooks.length === 0) {
          toast("No books are currently available.");

          return;
        }

        if (allStudents.length === 0) {
          toast("No students available.");

          return;
        }

        modal(
          "Borrow Book",
          `
              <div
                style="
                  display:grid;
                  gap:14px;
                "
              >

                <label>
                  Book
                  <select
                    id="borrow-book"
                    style="
                      width:100%;
                      padding:10px;
                    "
                  >

                    ${availableBooks
                      .map(function (book) {
                        return `
                            <option
                              value="${esc(book.id)}"
                            >
                              ${esc(book.title)}
                            </option>
                          `;
                      })
                      .join("")}

                  </select>
                </label>


                <label>
                  Student
                  <select
                    id="borrow-student"
                    style="
                      width:100%;
                      padding:10px;
                    "
                  >

                    ${allStudents
                      .map(function (student) {
                        return `
                            <option
                              value="${esc(student.id)}"
                            >
                              ${esc(studentFullName(student))}
                            </option>
                          `;
                      })
                      .join("")}

                  </select>
                </label>

              </div>
            `,
          function (backdrop) {
            const bookId = backdrop.querySelector("#borrow-book").value;

            const studentId = backdrop.querySelector("#borrow-student").value;

            const selectedBook = books().find(function (book) {
              return book.id === bookId;
            });

            if (!selectedBook) {
              toast("Book not found.");

              return;
            }

            if (Number(selectedBook.available) <= 0) {
              toast("Book is not available.");

              return;
            }

            const updatedBooks = books().map(function (book) {
              if (book.id === bookId) {
                const newAvailable = Number(book.available) - 1;

                return {
                  id: book.id,

                  title: book.title,

                  author: book.author,

                  category: book.category,

                  isbn: book.isbn,

                  quantity: book.quantity,

                  available: newAvailable,

                  status: newAvailable > 0 ? "Available" : "Unavailable",
                };
              }

              return book;
            });

            const tx = transactions();

            tx.push({
              id: "TX" + Date.now(),

              book_id: bookId,

              student_id: studentId,

              type: "Borrow",

              date: new Date().toISOString(),

              status: "Borrowed",
            });

            const booksSaved = set(KEY_BOOKS, updatedBooks);

            const txSaved = set(KEY_TX, tx);

            if (!booksSaved || !txSaved) {
              toast("Transaction was not saved.");

              return;
            }

            backdrop.remove();

            render();

            toast("Book borrowed.");
          },
        );
      };
    }

    render();
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  function pageDashboard() {
    const allBooks = books();

    const allStudents = students();

    const allTransactions = transactions();

    const numberElements = document.querySelectorAll(".stat-card .text-3xl, .stat-value");

    if (numberElements.length >= 3) {
      numberElements[0].textContent = allBooks.length;

      numberElements[1].textContent = allStudents.length;

      numberElements[2].textContent = allTransactions.filter(function (tx) {
        return tx.status === "Borrowed";
      }).length;
    }
  }

  /* =========================================================
     REPORTS
  ========================================================= */

  function pageReports() {
    const table = document.querySelector(".data-table");

    if (!table) {
      return;
    }

    const tbody = table.tBodies[0];

    if (!tbody) {
      return;
    }

    const allStudents = students();

    tbody.innerHTML = allStudents
      .map(function (student) {
        return `
            <tr>

              <td>
                ${esc(student.id)}
              </td>

              <td>
                ${esc(student.grade_section_id)}
              </td>

              <td>
                ${esc(student.account_id)}
              </td>

              <td>
                ${esc(student.lastname)}
              </td>

              <td>
                ${esc(student.firstname)}
              </td>

              <td>
                ${esc(student.middlename)}
              </td>

              <td>
                ${esc(student.contact_no)}
              </td>

              <td>
                ${esc(formatDateTime(student.created_at))}
              </td>

              <td>
                ${esc(formatDateTime(student.updated_at))}
              </td>

            </tr>
          `;
      })
      .join("");

    paginate(table, 5, 1);
  }

  /* =========================================================
     SETTINGS
  ========================================================= */

  function pageSettings() {
    const profile = get(KEY_PROFILE, {
      name: "Britech College Library",

      email: "library@britech.edu",
    });

    const nameInput = document.querySelector('input[name="name"], #profile-name');

    const emailInput = document.querySelector('input[name="email"], #profile-email');

    if (nameInput) {
      nameInput.value = profile.name || "";
    }

    if (emailInput) {
      emailInput.value = profile.email || "";
    }

    const elements = Array.from(document.querySelectorAll("button, a"));

    const saveButton = elements.find(function (element) {
      return element.textContent.trim().toLowerCase().includes("save changes");
    });

    if (saveButton) {
      saveButton.onclick = function (event) {
        event.preventDefault();

        const name = nameInput ? nameInput.value.trim() : profile.name;

        const email = emailInput ? emailInput.value.trim() : profile.email;

        set(KEY_PROFILE, {
          name: name,
          email: email,
        });

        toast("Settings saved.");
      };
    }
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function wireNav() {
    document.querySelectorAll('a[href="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
      });
    });

    const searchInputs = document.querySelectorAll(".topbar input");

    searchInputs.forEach(function (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
    });
  }

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  /* =========================================================
   SIGN IN PAGE
========================================================= */

  const toggleBtn = document.getElementById("togglePassword");
  const pwField = document.getElementById("loginPassword");
  if (toggleBtn && pwField) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = pwField.type === "password";
      pwField.type = isHidden ? "text" : "password";
      toggleBtn.classList.toggle("is-visible", isHidden);
      toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  }

  const form = document.getElementById("signInForm");
  const errorMsg = document.getElementById("loginError");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("loginId").value.trim();
      const pw = document.getElementById("loginPassword").value.trim();

      if (!id || !pw) {
        errorMsg.textContent = "Please enter both your username/email and password.";
        errorMsg.style.display = "block";
        return;
      }

      errorMsg.style.display = "none";
      console.log("Submitting login for:", id);

      window.location.href = "../pages/dashboard.html";
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function init() {
    wireNav();

    const title = document.title.toLowerCase();

    if (title.includes("students")) {
      pageStudents();
    } else if (title.includes("books")) {
      pageBooks();
    } else if (title.includes("borrow") || title.includes("return")) {
      pageBorrowReturn();
    } else if (title.includes("dashboard")) {
      pageDashboard();
    } else if (title.includes("reports")) {
      pageReports();
    } else if (title.includes("settings")) {
      pageSettings();
    }
  }

  /* =========================================================
     START
  ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
