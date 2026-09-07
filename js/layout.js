export async function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}`);
        }
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

export async function loadLayout() {
    const promises = [];
    
    if (document.getElementById('app-header')) {
        promises.push(loadComponent('app-header', 'components/header.html'));
    }
    
    if (document.getElementById('app-footer')) {
        promises.push(loadComponent('app-footer', 'components/footer.html'));
    }
    
    if (document.getElementById('app-modals')) {
        promises.push(loadComponent('app-modals', 'components/modals.html'));
    }
    
    await Promise.all(promises);
    
    // Bind global header events after it's loaded
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');

    if (mobileToggle && navigation) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navigation.classList.toggle('active');
        });

        navigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navigation.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navigation.contains(e.target) && !mobileToggle.contains(e.target)) {
                navigation.classList.remove('active');
            }
        });
    }
}
