/**
 * Herotopia - Library Module
 * Handles digital library browsing and file operations
 */

let libraryData = [];
let libraryPath = [];

/**
 * Load library structure from server
 */
async function loadLibrary() {
    const libraryContent = document.getElementById('library-content');
    
    // Show loading
    libraryContent.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading library...</p>
        </div>
    `;
    
    try {
        const response = await apiRequest('/library', null, 'GET');
        
        if (response.success) {
            libraryData = response.items;
            displayLibrary(libraryData);
        } else {
            libraryContent.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning">
                        <strong>⚠️ Library Error:</strong> ${response.error}
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading library:', error);
        libraryContent.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <strong>❌ Error:</strong> Failed to load library. ${error.message}
                </div>
            </div>
        `;
    }
}

/**
 * Display library items
 * @param {Array} items - Library items to display
 */
function displayLibrary(items) {
    const libraryContent = document.getElementById('library-content');
    
    if (!items || items.length === 0) {
        libraryContent.innerHTML = `
            <div class="col-12 text-center">
                <div class="empty-library">
                    <div style="font-size: 3rem; margin: 2rem 0;">📚</div>
                    <h4>Library is empty</h4>
                    <p>Add files and folders to the /library/ directory to get started.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Create grid
    libraryContent.className = 'library-grid';
    libraryContent.innerHTML = '';
    
    items.forEach(item => {
        const itemElement = createLibraryItemElement(item);
        libraryContent.appendChild(itemElement);
    });
}

/**
 * Create a library item element
 * @param {Object} item - Library item data
 * @returns {HTMLElement} Item element
 */
function createLibraryItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `library-item ${item.type}`;
    itemDiv.dataset.name = item.name.toLowerCase();
    itemDiv.dataset.path = item.path;
    
    if (item.type === 'folder') {
        // Folder item
        itemDiv.onclick = () => navigateToFolder(item.path, item.name);
        itemDiv.style.cursor = 'pointer';
        
        itemDiv.innerHTML = `
            <span class="library-item-icon">${item.icon}</span>
            <div class="library-item-name">${escapeHtml(item.name)}</div>
            <div class="library-item-category">
                ${item.children ? item.children.length : 0} items
            </div>
        `;
    } else {
        // File item
        const fileExtension = item.name.split('.').pop().toUpperCase();
        const fileSize = item.size_human || formatFileSize(item.size);
        
        itemDiv.onclick = () => openLibraryFile(item.path, item.name);
        itemDiv.style.cursor = 'pointer';
        
        itemDiv.innerHTML = `
            <span class="library-item-icon">${item.icon}</span>
            <div class="library-item-name">${escapeHtml(item.name)}</div>
            <div class="library-item-category">${item.category}</div>
            <span class="file-type-badge">${fileExtension}</span>
            <div class="library-item-size">${fileSize}</div>
        `;
    }
    
    // Right-click context menu
    itemDiv.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showLibraryContextMenu(e, item);
    });
    
    return itemDiv;
}

/**
 * Navigate to a folder
 * @param {string} path - Folder path
 * @param {string} name - Folder name
 */
function navigateToFolder(path, name) {
    // Update breadcrumb path
    if (path) {
        libraryPath.push({ name: name, path: path });
    }
    
    // Find the folder data
    let currentData = libraryData;
    const pathParts = path ? path.split('/') : [];
    
    for (const part of pathParts) {
        const folder = currentData.find(item => item.name === part && item.type === 'folder');
        if (folder) {
            currentData = folder.children || [];
        } else {
            currentData = [];
            break;
        }
    }
    
    // Display folder contents
    displayLibrary(currentData);
    updateLibraryBreadcrumb();
}

/**
 * Go back in library navigation
 */
function goBackInLibrary() {
    if (libraryPath.length > 0) {
        libraryPath.pop();
    }
    
    // Navigate to parent folder
    const path = libraryPath.map(item => item.name).join('/');
    
    // Re-navigate from root
    libraryPath = [];
    if (path) {
        navigateToFolder(path, '');
    } else {
        displayLibrary(libraryData);
    }
    
    updateLibraryBreadcrumb();
}

/**
 * Update library breadcrumb navigation
 */
function updateLibraryBreadcrumb() {
    let breadcrumbHTML = `<a href="#" onclick="displayLibrary(libraryData); libraryPath = []; updateLibraryBreadcrumb(); return false;">📚 Library</a>`;
    
    libraryPath.forEach((item, index) => {
        breadcrumbHTML += ` > <a href="#" onclick="handleBreadcrumbClick(${index}); return false;">${escapeHtml(item.name)}</a>`;
    });
    
    const breadcrumbDiv = document.getElementById('library-breadcrumb');
    if (breadcrumbDiv) {
        breadcrumbDiv.innerHTML = breadcrumbHTML;
    }
}

/**
 * Handle breadcrumb click
 * @param {number} index - Breadcrumb index
 */
function handleBreadcrumbClick(index) {
    libraryPath = libraryPath.slice(0, index + 1);
    const path = libraryPath.map(item => item.name).join('/');
    
    libraryPath = [];
    if (path) {
        navigateToFolder(path, '');
    } else {
        displayLibrary(libraryData);
    }
    
    updateLibraryBreadcrumb();
}

/**
 * Open a library file
 * @param {string} path - File path
 * @param {string} name - File name
 */
function openLibraryFile(path, name) {
    const fileExtension = name.split('.').pop().toLowerCase();
    const filePath = `/library/${path}`;
    
    // Determine how to open based on file type
    if (['pdf', 'txt'].includes(fileExtension)) {
        // Open in new window
        window.open(filePath, '_blank');
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension)) {
        // Display image in modal
        showImagePreview(filePath, name);
    } else if (['mp4', 'webm', 'avi', 'mkv'].includes(fileExtension)) {
        // Play video
        showVideoPlayer(filePath, name);
    } else {
        // Generic download
        downloadFile(filePath, name);
    }
}

/**
 * Show image preview in modal
 * @param {string} src - Image source
 * @param {string} name - Image name
 */
function showImagePreview(src, name) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `image-modal-${Date.now()}`;
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${escapeHtml(name)}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${src}" alt="${escapeHtml(name)}" class="img-fluid" style="max-height: 70vh;">
                </div>
                <div class="modal-footer">
                    <a href="${src}" download class="btn btn-primary">📥 Download</a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

/**
 * Show video player
 * @param {string} src - Video source
 * @param {string} name - Video name
 */
function showVideoPlayer(src, name) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `video-modal-${Date.now()}`;
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">🎬 ${escapeHtml(name)}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <video width="100%" controls style="max-height: 70vh;">
                        <source src="${src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

/**
 * Download file
 * @param {string} src - File source
 * @param {string} name - File name
 */
function downloadFile(src, name) {
    const link = document.createElement('a');
    link.href = src;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Downloading ${name}...`, 'info');
}

/**
 * Filter library items by search term
 * @param {string} searchTerm - Search term
 */
function filterLibraryItems(searchTerm) {
    const items = document.querySelectorAll('.library-item');
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const name = item.dataset.name;
        if (name.includes(lowerSearchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Show context menu for library item
 * @param {Event} event - Context menu event
 * @param {Object} item - Library item
 */
function showLibraryContextMenu(event, item) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        top: ${event.pageY}px;
        left: ${event.pageX}px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 150px;
    `;
    
    let menuHTML = '';
    
    if (item.type === 'file') {
        menuHTML += `
            <a href="#" onclick="openLibraryFile('${item.path}', '${escapeHtml(item.name)}'); this.closest('.context-menu').remove(); return false;" 
               style="display:block; padding:8px 12px; color:#000; text-decoration:none; cursor:pointer;">
                📂 Open
            </a>
            <a href="/library/${item.path}" download="${item.name}"
               style="display:block; padding:8px 12px; color:#000; text-decoration:none; cursor:pointer;" 
               onclick="this.closest('.context-menu').remove();">
                📥 Download
            </a>
        `;
    }
    
    menuHTML += `
        <a href="#" onclick="copyToClipboard('${item.path}'); this.closest('.context-menu').remove(); return false;" 
           style="display:block; padding:8px 12px; color:#000; text-decoration:none; cursor:pointer; border-top: 1px solid #eee;">
            📋 Copy Path
        </a>
    `;
    
    menu.innerHTML = menuHTML;
    document.body.appendChild(menu);
    
    // Remove menu on click elsewhere
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (e.target !== menu && !menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 0);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}
