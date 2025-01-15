document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const inputLabel = document.querySelector('.form-group:nth-child(2) label');
    const inputPlaceholder = document.querySelector('.amount-input input');
    const maxButton = document.querySelector('.max-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Update input label and placeholder based on tab
            if (button.dataset.tab === 'receive') {
                inputLabel.textContent = 'Enter Verification String';
                inputPlaceholder.placeholder = 'Enter your verification string...';
                maxButton.style.display = 'none';
            } else {
                inputLabel.textContent = 'Amount';
                inputPlaceholder.placeholder = '0.0';
                maxButton.style.display = 'block';
            }
        });
    });

    // Modal functionality
    const reviewBtn = document.querySelector('.review-btn');
    const reviewModal = document.getElementById('reviewModal');
    const successModal = document.getElementById('successModal');
    const closeButtons = document.querySelectorAll('.close-btn, .close-modal-btn');

    reviewBtn.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        if (activeTab === 'receive') {
            successModal.style.display = 'flex';
        } else {
            reviewModal.style.display = 'flex';
        }
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            reviewModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });

    // Copy button functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeElement = button.parentElement.querySelector('code');
            try {
                await navigator.clipboard.writeText(codeElement.textContent.trim());
                button.innerHTML = '<span style="color: #10B981;">✓</span>';
                setTimeout(() => {
                    button.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>`;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // Recent Activity functionality
    function generateRandomAmount() {
        return (Math.random() * 49.9 + 0.1).toFixed(2);
    }

    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    }

    function createActivityItem(type, amount, isNew = false) {
        const item = document.createElement('div');
        item.className = `activity-item ${isNew ? 'new' : ''}`;
        item.innerHTML = `
            <div class="activity-header">
                <svg class="external-link" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <div class="activity-info">
                    <div class="activity-type">${type}</div>
                    <div class="activity-time">${formatTimeAgo(new Date())}</div>
                </div>
                <div class="activity-amount">${amount} SOL</div>
            </div>
        `;
        return item;
    }

    // Initialize recent activity
    const activityList = document.querySelector('.activity-list');
    for (let i = 0; i < 4; i++) {
        const type = Math.random() > 0.5 ? 'Send' : 'Receive';
        const amount = generateRandomAmount();
        activityList.appendChild(createActivityItem(type, amount));
    }

    // Add new activity periodically
    setInterval(() => {
        const type = Math.random() > 0.5 ? 'Send' : 'Receive';
        const amount = generateRandomAmount();
        const newItem = createActivityItem(type, amount, true);
        
        activityList.insertBefore(newItem, activityList.firstChild);
        if (activityList.children.length > 4) {
            activityList.removeChild(activityList.lastChild);
        }

        setTimeout(() => {
            newItem.classList.remove('new');
        }, 2000);
    }, 5000 + Math.random() * 10000);
});
