// ==========================================================================
// Cybersecurity Lab Application Dashboard - Interactive Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initVerificationChecklist();
  initCodeCopyButtons();
  initTabs();
  initAccordions();
  initEvidenceDropzones();
  initScrollSpy();
  initMobileNav();
});

// --------------------------------------------------------------------------
// 1. Interactive Verification Checklist with LocalStorage Persistence
// --------------------------------------------------------------------------

const CHECKLIST_ITEMS = [
  { id: 'task-1', title: 'Docker Engine installed on host system' },
  { id: 'task-2', title: 'Docker daemon runtime actively running' },
  { id: 'task-3', title: 'OWASP Juice Shop container image downloaded' },
  { id: 'task-4', title: 'Juice Shop container running in bridge mode' },
  { id: 'task-5', title: 'Localhost browser access verified (http://localhost:3000)' },
  { id: 'task-6', title: 'Port binding verified strictly to 127.0.0.1:3000' },
  { id: 'task-7', title: 'Lab topology and network isolation diagrams reviewed' },
  { id: 'task-8', title: 'Rules of Engagement (ROE) document reviewed and signed' },
  { id: 'task-9', title: 'All 6 evidence screenshots collected without fabrication' },
  { id: 'task-10', title: 'GitHub repository prepared with complete documentation' }
];

function initVerificationChecklist() {
  const container = document.getElementById('checklist-items-container');
  if (!container) return;

  const savedState = JSON.parse(localStorage.getItem('secLabChecklist') || '{}');
  container.innerHTML = '';

  CHECKLIST_ITEMS.forEach((item, index) => {
    const isCompleted = !!savedState[item.id];
    const el = document.createElement('div');
    el.className = `check-item ${isCompleted ? 'completed' : ''}`;
    el.setAttribute('data-id', item.id);
    el.innerHTML = `
      <div class="check-left">
        <div class="custom-checkbox">
          ${isCompleted ? '✓' : ''}
        </div>
        <div class="check-text">
          <span style="font-family: var(--font-mono); color: var(--text-muted); margin-right: 6px;">[0${index + 1}]</span>
          ${item.title}
        </div>
      </div>
      <div class="check-tag ${isCompleted ? 'tag-done' : 'tag-pending'}">
        ${isCompleted ? 'VERIFIED' : 'PENDING'}
      </div>
    `;

    el.addEventListener('click', () => {
      toggleChecklistItem(item.id);
    });

    container.appendChild(el);
  });

  updateChecklistProgress();

  const resetBtn = document.getElementById('reset-checklist-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all verification checklist items? You must re-verify each task manually.')) {
        localStorage.removeItem('secLabChecklist');
        initVerificationChecklist();
      }
    });
  }

  const exportBtn = document.getElementById('export-report-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportAuditReport);
  }
}

function toggleChecklistItem(id) {
  const savedState = JSON.parse(localStorage.getItem('secLabChecklist') || '{}');
  savedState[id] = !savedState[id];
  localStorage.setItem('secLabChecklist', JSON.stringify(savedState));
  initVerificationChecklist();
}

function updateChecklistProgress() {
  const savedState = JSON.parse(localStorage.getItem('secLabChecklist') || '{}');
  const completedCount = CHECKLIST_ITEMS.filter(item => !!savedState[item.id]).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  const fillEl = document.getElementById('checklist-progress-fill');
  const percentEl = document.getElementById('checklist-progress-percent');
  const countEl = document.getElementById('checklist-progress-count');

  if (fillEl) fillEl.style.width = `${percent}%`;
  if (percentEl) percentEl.textContent = `${percent}%`;
  if (countEl) countEl.textContent = `${completedCount} of ${totalCount} Tasks Verified`;

  // Update top bar badge if present
  const topBadge = document.getElementById('top-bar-verify-badge');
  if (topBadge) {
    if (percent === 100) {
      topBadge.className = 'badge-tag badge-secure';
      topBadge.textContent = '100% VERIFIED';
    } else {
      topBadge.className = 'badge-tag badge-warning';
      topBadge.textContent = `${percent}% VERIFIED`;
    }
  }
}

function exportAuditReport() {
  const savedState = JSON.parse(localStorage.getItem('secLabChecklist') || '{}');
  const completedCount = CHECKLIST_ITEMS.filter(item => !!savedState[item.id]).length;
  const percent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);
  const now = new Date().toISOString();

  let report = `================================================================================\n`;
  report += `         CYBERSECURITY LAB AUDIT & VERIFICATION REPORT\n`;
  report += `================================================================================\n`;
  report += `Project:     Legal Scope and Isolated Lab – Safe Cybersecurity Practice\n`;
  report += `Target:      OWASP Juice Shop (127.0.0.1:3000)\n`;
  report += `Generated:   ${now}\n`;
  report += `Audit Score: ${completedCount}/${CHECKLIST_ITEMS.length} Tasks (${percent}% Complete)\n`;
  report += `================================================================================\n\n`;

  CHECKLIST_ITEMS.forEach((item, idx) => {
    const status = savedState[item.id] ? '[x] VERIFIED ' : '[ ] PENDING  ';
    report += `${status} Task ${idx + 1}: ${item.title}\n`;
  });

  report += `\n================================================================================\n`;
  report += `PRACTITIONER DECLARATION:\n`;
  report += `I certify that verified tasks reflect actual executions and genuine evidence.\n`;
  report += `================================================================================\n`;

  const blob = new Blob([report], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cybersecurity-lab-audit-verification-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// --------------------------------------------------------------------------
// 2. One-Click Command Copying
// --------------------------------------------------------------------------

function initCodeCopyButtons() {
  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-window')?.querySelector('.code-body');
      if (!codeBlock) return;

      const rawText = codeBlock.innerText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('$') || line.startsWith('PS') || line.startsWith('docker') || line.startsWith('sudo') || line.startsWith('wsl'))
        .map(line => line.replace(/^(\$|PS [^>]+>)\s*/, ''))
        .join('\n');

      const copyTarget = rawText || codeBlock.innerText;

      navigator.clipboard.writeText(copyTarget).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = '#10b981';
        btn.style.borderColor = '#10b981';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      });
    });
  });
}

// --------------------------------------------------------------------------
// 3. Tab Navigation (Windows vs. Ubuntu)
// --------------------------------------------------------------------------

function initTabs() {
  document.querySelectorAll('.tab-container').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panes = container.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        buttons.forEach(b => b.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = container.querySelector(`#${targetId}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  });
}

// --------------------------------------------------------------------------
// 4. Accordion Toggle
// --------------------------------------------------------------------------

function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (item) {
        item.classList.toggle('active');
      }
    });
  });

  document.querySelectorAll('.evidence-instr-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (content) {
        const isShown = content.style.display === 'block';
        content.style.display = isShown ? 'none' : 'block';
        btn.textContent = isShown ? '▶ View Capture Instructions' : '▼ Hide Capture Instructions';
      }
    });
  });
}

// --------------------------------------------------------------------------
// 5. Evidence Local Dropzone Preview
// --------------------------------------------------------------------------

function initEvidenceDropzones() {
  document.querySelectorAll('.dropzone-placeholder').forEach(dropzone => {
    const fileInput = dropzone.querySelector('input[type="file"]');
    const previewImg = dropzone.querySelector('.dropzone-preview');
    const promptText = dropzone.querySelector('.dropzone-prompt');
    const card = dropzone.closest('.evidence-card');
    const statusEl = card?.querySelector('.evidence-status');

    dropzone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--emerald)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          handleFile(fileInput.files[0]);
        }
      });
    }

    function handleFile(file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, or SVG).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (previewImg) {
          previewImg.src = event.target.result;
          previewImg.style.display = 'block';
        }
        if (promptText) {
          promptText.style.display = 'none';
        }
        if (statusEl) {
          statusEl.textContent = 'PREVIEW LOADED';
          statusEl.classList.add('verified');
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// --------------------------------------------------------------------------
// 6. ScrollSpy for Sidebar Links
// --------------------------------------------------------------------------

function initScrollSpy() {
  const sections = document.querySelectorAll('.section-block');
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// --------------------------------------------------------------------------
// 7. Mobile Navigation Drawer
// --------------------------------------------------------------------------

function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    });
  }
}

