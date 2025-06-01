const addForumBtn = document.querySelector('.add-forum-btn');
const body = document.body;

const modalHTML = `
  <div class="modal-overlay" id="forumModal">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close-btn" id="closeModal">×</button>
      </div>
      <form class="forum-form">
        <input type="text" placeholder="Enter forum title..." class="title-input">
        <textarea placeholder="What's Happening?" class="content-textarea"></textarea>
        <div class="form-actions">
          <button type="submit" class="upload-btn">Upload</button>
        </div>
      </form>
    </div>
  </div>
`;

const modalCSS = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--white-color);
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    padding: 2rem;
    position: relative;
  }

  .modal-header {
    display: flex;
    justify-content: flex-end; 
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .modal-header h2 {
    font-family: "Inter", sans-serif;
    font-size: 1.5rem;
    color: var(--blue-color);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--gray-color);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: var(--blue-color);
  }

  .forum-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .title-input {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    outline: none;
  }

  .title-input:focus {
    border-color: var(--blue-color);
  }

  .content-textarea {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    min-height: 200px;
    resize: vertical;
    outline: none;
  }

  .content-textarea:focus {
    border-color: var(--blue-color);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }

  .upload-btn {
    background-color: var(--light-green-color);
    color: var(--blue-color);
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-family: "Anderson Grotesk";
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .upload-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const style = document.createElement('style');
style.textContent = modalCSS;
document.head.appendChild(style);

function showModal() {
  body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = document.getElementById('forumModal');
  const closeBtn = document.getElementById('closeModal');
  
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  const form = modal.querySelector('.forum-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted');
    closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('forumModal');
  if (modal) {
    modal.remove();
  }
}

addForumBtn.addEventListener('click', showModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});