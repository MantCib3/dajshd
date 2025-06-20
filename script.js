let articlesData = [];

function search() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const regionFilter = document.getElementById('regionFilter').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const featureArticle = document.querySelector('.feature-article');
    const articles = document.querySelectorAll('.article');
    const events = document.querySelectorAll('.event');
    const sectionArticles = document.querySelectorAll('.section-article');
    const financeFeatureArticle = document.querySelector('.finance-feature-article');
    const financeEvents = document.querySelectorAll('.finance-event');

    if (featureArticle) {
        const featureTitle = featureArticle.querySelector('h1').textContent.toLowerCase();
        const featureContent = featureArticle.querySelector('p').textContent.toLowerCase();
        featureArticle.style.display = (featureTitle.includes(query) || featureContent.includes(query)) ? 'block' : 'none';
    }

    if (financeFeatureArticle) {
        const financeFeatureTitle = financeFeatureArticle.querySelector('h1').textContent.toLowerCase();
        const financeFeatureContent = financeFeatureArticle.querySelector('p').textContent.toLowerCase();
        financeFeatureArticle.style.display = (financeFeatureTitle.includes(query) || financeFeatureContent.includes(query)) ? 'block' : 'none';
    }

    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const content = article.querySelector('p').textContent.toLowerCase();
        const articleDate = new Date(article.querySelector('.date').textContent).toISOString().split('T')[0];
        article.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || article.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || articleDate === dateFilter) ? 'flex' : 'none';
    });

    events.forEach(event => {
        const title = event.querySelector('h4').textContent.toLowerCase();
        const content = event.querySelector('p').textContent.toLowerCase();
        const eventDate = new Date(event.querySelector('.date').textContent).toISOString().split('T')[0];
        event.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || event.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || eventDate === dateFilter) ? 'flex' : 'none';
    });

    financeEvents.forEach(event => {
        const title = event.querySelector('h4').textContent.toLowerCase();
        const content = event.querySelector('p').textContent.toLowerCase();
        const eventDate = new Date(event.querySelector('.date').textContent).toISOString().split('T')[0];
        event.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || event.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || eventDate === dateFilter) ? 'flex' : 'none';
    });

    sectionArticles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const content = article.querySelector('p').textContent.toLowerCase();
        const articleDate = new Date(article.querySelector('.date').textContent).toISOString().split('T')[0];
        article.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || article.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || articleDate === dateFilter) ? 'flex' : 'none';
    });
}

function showSectionView(section) {
    console.log(`Opening section: ${section}`);
    const mainContent = document.getElementById('main-content');
    let articlesToShow = [];
    let title = '';

    if (section === 'latest') {
        title = 'Latest';
        articlesToShow = articlesData.slice(1, Math.min(4, articlesData.length));
    } else if (section === 'world') {
        title = 'World';
        articlesToShow = articlesData.filter(a => a.category.toLowerCase() === 'world');
    } else if (section === 'events') {
        title = 'Events';
        articlesToShow = articlesData.filter(a => a.category.toLowerCase() !== 'world');
    } else if (section === 'financial') {
        title = 'Finance';
        articlesToShow = articlesData.filter(a => a.category.toLowerCase() === 'financial');
    }

    console.log(`Articles to show: ${articlesToShow.length}`);
    mainContent.classList.add('section-view');
    mainContent.classList.remove('article-detail-view');
    document.querySelector('.lower-sections').style.display = 'none';
    document.querySelector('.financial-section').style.display = 'none';
    mainContent.innerHTML = `
        <div class="section-view">
            <a href="#" class="back-button" onclick="restoreMainContent(); return false;"><i class="fas fa-arrow-left"></i></a>
            <h1>${title}</h1>
            <div class="section-articles">
                ${articlesToShow.length > 0 ? articlesToShow.map(a => `
                    <div class="section-article" data-article-id="${a.id}" data-region="${a.region || ''}">
                        <div class="article-image-container" style="background-image: url('${a.image}')"></div>
                        <div class="article-content">
                            <h3>${a.title}</h3>
                            <div class="date">${new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <p>${a.content}</p>
                        </div>
                    </div>
                `).join('') : '<div class="no-articles">No articles available.</div>'}
            </div>
        </div>
    `;

    attachArticleEventListeners();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showSearchView() {
    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('section-view');
    mainContent.classList.remove('article-detail-view');
    document.querySelector('.lower-sections').style.display = 'none';
    document.querySelector('.financial-section').style.display = 'none';
    const uniqueDates = [...new Set(articlesData.map(a => new Date(a.date).toISOString().split('T')[0]))];
    const uniqueRegions = [...new Set(articlesData.map(a => a.region || 'Global'))];

    mainContent.innerHTML = `
        <div class="section-view">
            <a href="#" class="back-button" onclick="restoreMainContent(); return false;"><i class="fas fa-arrow-left"></i></a>
            <h1>Search Results</h1>
            <div class="search-filters">
                <input type="text" id="searchInput" placeholder="Search..." onkeypress="if(event.key === 'Enter') search()">
                <select id="regionFilter">
                    <option value="">All Regions</option>
                    ${uniqueRegions.map(region => `<option value="${region}">${region}</option>`).join('')}
                </select>
                <select id="dateFilter">
                    <option value="">All Dates</option>
                    ${uniqueDates.map(date => `<option value="${date}">${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</option>`).join('')}
                </select>
                <button onclick="search()">Search</button>
            </div>
            <div class="section-articles">
                ${articlesData.length > 0 ? articlesData.map(a => `
                    <div class="section-article" data-article-id="${a.id}" data-region="${a.region || 'Global'}">
                        <div class="article-image-container" style="background-image: url('${a.image}')"></div>
                        <div class="article-content">
                            <h3>${a.title}</h3>
                            <div class="date">${new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <p>${a.content}</p>
                        </div>
                    </div>
                `).join('') : '<div class="no-articles">No articles available.</div>'}
            </div>
        </div>
    `;

    attachArticleEventListeners();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateArticles() {
    if (!articlesData[0]) {
        console.error('No articles available to populate');
        return;
    }

    const featureArticle = document.getElementById('feature-article');
    const firstArticle = articlesData[0];
    featureArticle.setAttribute('data-article-id', firstArticle.id);
    const featureImage = featureArticle.querySelector('.feature-image-container');
    const featureText = featureArticle.querySelector('.feature-text');
    featureImage.style.backgroundImage = `url(${firstArticle.image})`;
    featureText.innerHTML = `
        <h1>${firstArticle.title}</h1>
        <div class="date">${new Date(firstArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <p>${firstArticle.lead}</p>
    `;

    const latestSection = document.getElementById('latest-section');
    latestSection.innerHTML = '<h3>Latest<span class="section-arrow"></span></h3>';
    for (let i = 1; i < Math.min(4, articlesData.length); i++) {
        const article = articlesData[i];
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.setAttribute('data-article-id', article.id);
        eventDiv.setAttribute('data-region', article.region || '');
        eventDiv.innerHTML = `
            <div class="event-image-container" style="background-image: url(${article.image})"></div>
            <div class="event-content">
                <h4>${article.title}</h4>
                <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <p>${article.lead}</p>
            </div>
        `;
        latestSection.appendChild(eventDiv);
    }

    const worldSection = document.getElementById('world');
    const eventsSection = document.getElementById('events');
    worldSection.innerHTML = '<h2>World<span class="section-arrow"></span></h2>';
    eventsSection.innerHTML = '<h2>Events<span class="section-arrow"></span></h2>';

    let worldCount = 0;
    let eventsCount = 0;
    let worldHasArticles = false;
    let eventsHasArticles = false;

    articlesData.forEach((article, index) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.setAttribute('data-article-id', article.id);
        articleDiv.setAttribute('data-region', article.region || '');
        articleDiv.innerHTML = `
            <div class="article-image-container" style="background-image: url(${article.image})"></div>
            <div class="article-content">
                <h3>${article.title}</h3>
                <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <p>${article.lead}</p>
            </div>
        `;

        if (article.category.toLowerCase() === 'world' && worldCount < 2) {
            worldSection.appendChild(articleDiv);
            worldCount++;
            worldHasArticles = true;
        } else if (article.category.toLowerCase() !== 'world' && eventsCount < 2) {
            eventsSection.appendChild(articleDiv);
            eventsCount++;
            eventsHasArticles = true;
        }
    });

    const financeFeatureArticle = document.getElementById('finance-feature-article');
    const financeLatestSection = document.getElementById('finance-latest-section');
    financeLatestSection.innerHTML = '<h3>Latest<span class="section-arrow"></span></h3>';

    const financeArticles = articlesData.filter(a => a.category.toLowerCase() === 'financial');
    if (financeArticles.length > 0) {
        const financeFeature = financeArticles[0];
        financeFeatureArticle.setAttribute('data-article-id', financeFeature.id);
        const financeFeatureImage = financeFeatureArticle.querySelector('.finance-feature-image-container');
        const financeFeatureText = financeFeatureArticle.querySelector('.finance-feature-text');
        financeFeatureImage.style.backgroundImage = `url(${financeFeature.image})`;
        financeFeatureText.innerHTML = `
            <h1>${financeFeature.title}</h1>
            <div class="date">${new Date(financeFeature.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <p>${financeFeature.lead}</p>
        `;

        for (let i = 1; i < Math.min(3, financeArticles.length); i++) {
            const article = financeArticles[i];
            const financeEventDiv = document.createElement('div');
            financeEventDiv.className = 'finance-event';
            financeEventDiv.setAttribute('data-article-id', article.id);
            financeEventDiv.setAttribute('data-region', article.region || '');
            financeEventDiv.innerHTML = `
                <div class="finance-event-image-container" style="background-image: url(${article.image})"></div>
                <div class="finance-event-content">
                    <h4>${article.title}</h4>
                    <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <p>${article.lead}</p>
                </div>
            `;
            financeLatestSection.appendChild(financeEventDiv);
        }
    } else {
        financeFeatureArticle.innerHTML = '<div class="no-articles">No financial articles available.</div>';
        financeLatestSection.innerHTML += '<div class="no-articles">No financial articles available.</div>';
    }

    if (worldHasArticles) {
        const noArticles = worldSection.querySelector('.no-articles');
        if (noArticles) noArticles.remove();
    }
    if (eventsHasArticles) {
        const noArticles = eventsSection.querySelector('.no-articles');
        if (noArticles) noArticles.remove();
    }

    attachArticleEventListeners();
}

function restoreMainContent() {
    console.log('Restoring main content');
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('article-detail-view', 'section-view');
    mainContent.innerHTML = `
        <div class="feature-article" id="feature-article">
            <div class="feature-image-container"></div>
            <div class="feature-text">
                <h1>Loading...</h1>
                <div class="date">Loading...</div>
                <p>Loading...</p>
            </div>
        </div>
        <aside class="latest-section" id="latest-section">
            <h3>Latest<span class="section-arrow"></span></h3>
        </aside>
    `;
    document.querySelector('.lower-sections').style.display = 'flex';
    document.querySelector('.financial-section').style.display = 'block';
    populateArticles();
}

function showArticleDetail(articleId) {
    console.log('Showing article with ID:', articleId);
    const article = articlesData.find(a => a.id === articleId);
    if (!article) {
        console.error('Article not found for ID:', articleId);
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '<div class="no-articles">Article not found.</div>';
        document.querySelector('.lower-sections').style.display = 'none';
        document.querySelector('.financial-section').style.display = 'none';
        return;
    }

    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('article-detail-view');
    mainContent.classList.remove('section-view');
    document.querySelector('.lower-sections').style.display = 'none';
    document.querySelector('.financial-section').style.display = 'none';
    mainContent.innerHTML = `
        <div class="article-detail">
            <a href="#" class="back-button" onclick="restoreMainContent(); return false;"><i class="fas fa-arrow-left"></i></a>
            <h1>${article.title}</h1>
            <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="article-image" style="background-image: url('${article.image}')"></div>
            <div class="dot-points">
                <ul>
                    ${article.dot_points.length > 0 ? article.dot_points.map(point => `<li>${point}</li>`).join('') : '<li>No key points available.</li>'}
                </ul>
            </div>
            <div class="content">${article.content}</div>
            ${article.quotes && article.quotes.length > 0 ? article.quotes.map(q => `
                <div class="quote">${q.text}</div>
                <div class="quote-source">${q.source || q.speaker || 'Unknown'}</div>
            `).join('') : ''}
            <div class="sources">
                <h3>Sources</h3>
                <ul>
                    ${article.sources.length > 0 ? article.sources.map(s => `<li><a href="${s.url}" target="_blank">${s.title}</a></li>`).join('') : '<li>No sources available.</li>'}
                </ul>
            </div>
        </div>
    `;
    document.querySelector('.article-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function attachArticleEventListeners() {
    const elements = document.querySelectorAll('[data-article-id]');
    console.log('Found elements with data-article-id:', elements.length);
    elements.forEach(element => {
        element.removeEventListener('click', handleArticleClick);
        element.addEventListener('click', handleArticleClick);
    });

    function handleArticleClick(event) {
        event.preventDefault();
        const articleId = event.currentTarget.getAttribute('data-article-id');
        console.log('Clicked article ID:', articleId);
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (articlesData.find(a => a.id === articleId)) {
            showArticleDetail(articleId);
        } else {
            console.error('No article found for ID:', articleId);
        }
    }

    const sectionArrows = document.querySelectorAll('.section-arrow');
    console.log('Found section arrows:', sectionArrows.length);
    sectionArrows.forEach(arrow => {
        arrow.removeEventListener('click', handleSectionArrowClick);
        arrow.addEventListener('click', handleSectionArrowClick);
    });

    function handleSectionArrowClick(e) {
        e.preventDefault();
        const parentSection = e.currentTarget.closest('section, aside');
        let sectionId = '';
        if (parentSection.id === 'world') {
            sectionId = 'world';
        } else if (parentSection.id === 'events') {
            sectionId = 'events';
        } else if (parentSection.id === 'latest-section') {
            sectionId = 'latest';
        } else if (parentSection.id === 'financial' || parentSection.id === 'finance-latest-section') {
            sectionId = 'financial';
        }
        console.log('Clicked section arrow for:', sectionId);
        if (sectionId) {
            showSectionView(sectionId);
        }
    }

    const searchIcon = document.querySelector('.search-icon');
    searchIcon.removeEventListener('click', handleSearchClick);
    searchIcon.addEventListener('click', handleSearchClick);

    function handleSearchClick(e) {
        e.preventDefault();
        showSearchView();
    }
}

fetch('DB.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('JSON data loaded:', data);
        articlesData = data.articles.map(article => ({
            ...article,
            region: article.category === 'World' ? 'Global' : 'National' // Example region assignment
        })) || [];
        if (articlesData.length === 0) {
            console.error('No articles found in JSON');
            alert('No articles found in JSON');
            return;
        }
        populateArticles();
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
        alert('Failed to load articles. Please ensure the JSON file is accessible and try again.');
    });

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        search();
    }
});

function toggleSearch() {
    document.getElementById('searchBar').classList.toggle('active');
}

function search() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const regionFilter = document.getElementById('regionFilter').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const featureArticle = document.querySelector('.feature-article');
    const articles = document.querySelectorAll('.article');
    const events = document.querySelectorAll('.event');
    const sectionArticles = document.querySelectorAll('.section-article');
    const financeFeatureArticle = document.querySelector('.finance-feature-article');
    const financeEvents = document.querySelectorAll('.finance-event');

    if (featureArticle) {
        const featureTitle = featureArticle.querySelector('h1').textContent.toLowerCase();
        const featureContent = featureArticle.querySelector('p').textContent.toLowerCase();
        featureArticle.style.display = (featureTitle.includes(query) || featureContent.includes(query)) ? 'block' : 'none';
    }

    if (financeFeatureArticle) {
        const financeFeatureTitle = financeFeatureArticle.querySelector('h1').textContent.toLowerCase();
        const financeFeatureContent = financeFeatureArticle.querySelector('p').textContent.toLowerCase();
        financeFeatureArticle.style.display = (financeFeatureTitle.includes(query) || financeFeatureContent.includes(query)) ? 'block' : 'none';
    }

    articles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const content = article.querySelector('p').textContent.toLowerCase();
        const articleDate = new Date(article.querySelector('.date').textContent).toISOString().split('T')[0];
        article.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || article.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || articleDate === dateFilter) ? 'flex' : 'none';
    });

    events.forEach(event => {
        const title = event.querySelector('h4').textContent.toLowerCase();
        const content = event.querySelector('p').textContent.toLowerCase();
        const eventDate = new Date(event.querySelector('.date').textContent).toISOString().split('T')[0];
        event.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || event.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || eventDate === dateFilter) ? 'flex' : 'none';
    });

    financeEvents.forEach(event => {
        const title = event.querySelector('h4').textContent.toLowerCase();
        const content = event.querySelector('p').textContent.toLowerCase();
        const eventDate = new Date(event.querySelector('.date').textContent).toISOString().split('T')[0];
        event.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || event.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || eventDate === dateFilter) ? 'flex' : 'none';
    });

    sectionArticles.forEach(article => {
        const title = article.querySelector('h3').textContent.toLowerCase();
        const content = article.querySelector('p').textContent.toLowerCase();
        const articleDate = new Date(article.querySelector('.date').textContent).toISOString().split('T')[0];
        article.style.display = (title.includes(query) || content.includes(query)) && 
            (!regionFilter || article.getAttribute('data-region') === regionFilter) &&
            (!dateFilter || articleDate === dateFilter) ? 'flex' : 'none';
    });
}

function showSectionView(section) {
    console.log(`Opening section: ${section}`);
    const mainContent = document.getElementById('main-content');
    let articlesToShow = [];
    let title = '';

    if (section === 'latest') {
        title = 'Latest';
        articlesToShow = articlesData.slice(1, Math.min(4, articlesData.length));
    } else if (section === 'world') {
        title = 'World';
        articlesToShow = articlesData.filter(a => a.category.toLowerCase() === 'world');
    } else if (section === 'events') {
        title = 'Events';
        articlesToShow = articlesData.filter(a => a.category.toLowerCase() !== 'world');
    } else if (section === 'financial') {
        title = 'Finance';
        articlesToShow = articlesData.filter(a => a.category.toLowerCase() === 'financial');
    }

    console.log(`Articles to show: ${articlesToShow.length}`);
    mainContent.classList.add('section-view');
    mainContent.classList.remove('article-detail-view');
    document.querySelector('.lower-sections').style.display = 'none';
    document.querySelector('.financial-section').style.display = 'none';
    mainContent.innerHTML = `
        <div class="section-view">
            <a href="#" class="back-button" onclick="restoreMainContent(); return false;"><i class="fas fa-arrow-left"></i></a>
            <h1>${title}</h1>
            <div class="section-articles">
                ${articlesToShow.length > 0 ? articlesToShow.map(a => `
                    <div class="section-article" data-article-id="${a.id}" data-region="${a.region || ''}">
                        <div class="article-image-container" style="background-image: url('${a.image}')"></div>
                        <div class="article-content">
                            <h3>${a.title}</h3>
                            <div class="date">${new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <p>${a.content}</p>
                        </div>
                    </div>
                `).join('') : '<div class="no-articles">No articles available.</div>'}
            </div>
        </div>
    `;

    attachArticleEventListeners();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showSearchView() {
    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('section-view');
    mainContent.classList.remove('article-detail-view');
    document.querySelector('.lower-sections').style.display = 'none';
    document.querySelector('.financial-section').style.display = 'none';
    const uniqueDates = [...new Set(articlesData.map(a => new Date(a.date).toISOString().split('T')[0]))];
    const uniqueRegions = [...new Set(articlesData.map(a => a.region || 'Global'))];

    mainContent.innerHTML = `
        <div class="section-view">
            <a href="#" class="back-button" onclick="restoreMainContent(); return false;"><i class="fas fa-arrow-left"></i></a>
            <h1>Search Results</h1>
            <div class="search-filters">
                <input type="text" id="searchInput" placeholder="Search..." onkeypress="if(event.key === 'Enter') search()">
                <select id="regionFilter">
                    <option value="">All Regions</option>
                    ${uniqueRegions.map(region => `<option value="${region}">${region}</option>`).join('')}
                </select>
                <select id="dateFilter">
                    <option value="">All Dates</option>
                    ${uniqueDates.map(date => `<option value="${date}">${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</option>`).join('')}
                </select>
                <button onclick="search()">Search</button>
            </div>
            <div class="section-articles">
                ${articlesData.length > 0 ? articlesData.map(a => `
                    <div class="section-article" data-article-id="${a.id}" data-region="${a.region || 'Global'}">
                        <div class="article-image-container" style="background-image: url('${a.image}')"></div>
                        <div class="article-content">
                            <h3>${a.title}</h3>
                            <div class="date">${new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <p>${a.content}</p>
                        </div>
                    </div>
                `).join('') : '<div class="no-articles">No articles available.</div>'}
            </div>
        </div>
    `;

    attachArticleEventListeners();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateArticles() {
    if (!articlesData[0]) {
        console.error('No articles available to populate');
        return;
    }

    const featureArticle = document.getElementById('feature-article');
    const firstArticle = articlesData[0];
    featureArticle.setAttribute('data-article-id', firstArticle.id);
    const featureImage = featureArticle.querySelector('.feature-image-container');
    const featureText = featureArticle.querySelector('.feature-text');
    featureImage.style.backgroundImage = `url(${firstArticle.image})`;
    featureText.innerHTML = `
        <h1>${firstArticle.title}</h1>
        <div class="date">${new Date(firstArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <p>${firstArticle.lead}</p>
    `;

    const latestSection = document.getElementById('latest-section');
    latestSection.innerHTML = '<h3>Latest<span class="section-arrow"></span></h3>';
    for (let i = 1; i < Math.min(4, articlesData.length); i++) {
        const article = articlesData[i];
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.setAttribute('data-article-id', article.id);
        eventDiv.setAttribute('data-region', article.region || '');
        eventDiv.innerHTML = `
            <div class="event-image-container" style="background-image: url(${article.image})"></div>
            <div class="event-content">
                <h4>${article.title}</h4>
                <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <p>${article.lead}</p>
            </div>
        `;
        latestSection.appendChild(eventDiv);
    }

    const worldSection = document.getElementById('world');
    const eventsSection = document.getElementById('events');
    worldSection.innerHTML = '<h2>World<span class="section-arrow"></span></h2>';
    eventsSection.innerHTML = '<h2>Events<span class="section-arrow"></span></h2>';

    let worldCount = 0;
    let eventsCount = 0;
    let worldHasArticles = false;
    let eventsHasArticles = false;

    articlesData.forEach((article, index) => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.setAttribute('data-article-id', article.id);
        articleDiv.setAttribute('data-region', article.region || '');
        articleDiv.innerHTML = `
            <div class="article-image-container" style="background-image: url(${article.image})"></div>
            <div class="article-content">
                <h3>${article.title}</h3>
                <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <p>${article.lead}</p>
            </div>
        `;

        if (article.category.toLowerCase() === 'world' && worldCount < 2) {
            worldSection.appendChild(articleDiv);
            worldCount++;
            worldHasArticles = true;
        } else if (article.category.toLowerCase() !== 'world' && eventsCount < 2) {
            eventsSection.appendChild(articleDiv);
            eventsCount++;
            eventsHasArticles = true;
        }
    });

    const financeFeatureArticle = document.getElementById('finance-feature-article');
    const financeLatestSection = document.getElementById('finance-latest-section');
    financeLatestSection.innerHTML = '<h3>Latest<span class="section-arrow"></span></h3>';

    const financeArticles = articlesData.filter(a => a.category.toLowerCase() === 'financial');
    if (financeArticles.length > 0) {
        const financeFeature = financeArticles[0];
        financeFeatureArticle.setAttribute('data-article-id', financeFeature.id);
        const financeFeatureImage = financeFeatureArticle.querySelector('.finance-feature-image-container');
        const financeFeatureText = financeFeatureArticle.querySelector('.finance-feature-text');
        financeFeatureImage.style.backgroundImage = `url(${financeFeature.image})`;
        financeFeatureText.innerHTML = `
            <h1>${financeFeature.title}</h1>
            <div class="date">${new Date(financeFeature.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <p>${financeFeature.lead}</p>
        `;

        for (let i = 1; i < Math.min(3, financeArticles.length); i++) {
            const article = financeArticles[i];
            const financeEventDiv = document.createElement('div');
            financeEventDiv.className = 'finance-event';
            financeEventDiv.setAttribute('data-article-id', article.id);
            financeEventDiv.setAttribute('data-region', article.region || '');
            financeEventDiv.innerHTML = `
                <div class="finance-event-image-container" style="background-image: url(${article.image})"></div>
                <div class="finance-event-content">
                    <h4>${article.title}</h4>
                    <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <p>${article.lead}</p>
                </div>
            `;
            financeLatestSection.appendChild(financeEventDiv);
        }
    } else {
        financeFeatureArticle.innerHTML = '<div class="no-articles">No financial articles available.</div>';
        financeLatestSection.innerHTML += '<div class="no-articles">No financial articles available.</div>';
    }

    if (worldHasArticles) {
        const noArticles = worldSection.querySelector('.no-articles');
        if (noArticles) noArticles.remove();
    }
    if (eventsHasArticles) {
        const noArticles = eventsSection.querySelector('.no-articles');
        if (noArticles) noArticles.remove();
    }

    attachArticleEventListeners();
}

function restoreMainContent() {
    console.log('Restoring main content');
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('article-detail-view', 'section-view');
    mainContent.innerHTML = `
        <div class="feature-article" id="feature-article">
            <div class="feature-image-container"></div>
            <div class="feature-text">
                <h1>Loading...</h1>
                <div class="date">Loading...</div>
                <p>Loading...</p>
            </div>
        </div>
        <aside class="latest-section" id="latest-section">
            <h3>Latest<span class="section-arrow"></span></h3>
        </aside>
    `;
    document.querySelector('.lower-sections').style.display = 'flex';
    document.querySelector('.financial-section').style.display = 'block';
    populateArticles();
}

function showArticleDetail(articleId) {
    console.log('Showing article with ID:', articleId);
    const article = articlesData.find(a => a.id === articleId);
    if (!article) {
        console.error('Article not found for ID:', articleId);
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '<div class="no-articles">Article not found.</div>';
        document.querySelector('.lower-sections').style.display = 'none';
        document.querySelector('.financial-section').style.display = 'none';
        return;
    }

    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('article-detail-view');
    mainContent.classList.remove('section-view');
    document.querySelector('.lower-sections').style.display = 'none';
    document.querySelector('.financial-section').style.display = 'none';
    mainContent.innerHTML = `
        <div class="article-detail">
            <a href="#" class="back-button" onclick="restoreMainContent(); return false;"><i class="fas fa-arrow-left"></i></a>
            <h1>${article.title}</h1>
            <div class="date">${new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="article-image" style="background-image: url('${article.image}')"></div>
            <div class="dot-points">
                <ul>
                    ${article.dot_points.length > 0 ? article.dot_points.map(point => `<li>${point}</li>`).join('') : '<li>No key points available.</li>'}
                </ul>
            </div>
            <div class="content">${article.content}</div>
            ${article.quotes && article.quotes.length > 0 ? article.quotes.map(q => `
                <div class="quote">${q.text}</div>
                <div class="quote-source">${q.source || q.speaker || 'Unknown'}</div>
            `).join('') : ''}
            <div class="sources">
                <h3>Sources</h3>
                <ul>
                    ${article.sources.length > 0 ? article.sources.map(s => `<li><a href="${s.url}" target="_blank">${s.title}</a></li>`).join('') : '<li>No sources available.</li>'}
                </ul>
            </div>
        </div>
    `;
    document.querySelector('.article-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function attachArticleEventListeners() {
    const elements = document.querySelectorAll('[data-article-id]');
    console.log('Found elements with data-article-id:', elements.length);
    elements.forEach(element => {
        element.removeEventListener('click', handleArticleClick);
        element.addEventListener('click', handleArticleClick);
    });

    function handleArticleClick(event) {
        event.preventDefault();
        const articleId = event.currentTarget.getAttribute('data-article-id');
        console.log('Clicked article ID:', articleId);
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (articlesData.find(a => a.id === articleId)) {
            showArticleDetail(articleId);
        } else {
            console.error('No article found for ID:', articleId);
        }
    }

    const sectionArrows = document.querySelectorAll('.section-arrow');
    console.log('Found section arrows:', sectionArrows.length);
    sectionArrows.forEach(arrow => {
        arrow.removeEventListener('click', handleSectionArrowClick);
        arrow.addEventListener('click', handleSectionArrowClick);
    });

    function handleSectionArrowClick(e) {
        e.preventDefault();
        const parentSection = e.currentTarget.closest('section, aside');
        let sectionId = '';
        if (parentSection.id === 'world') {
            sectionId = 'world';
        } else if (parentSection.id === 'events') {
            sectionId = 'events';
        } else if (parentSection.id === 'latest-section') {
            sectionId = 'latest';
        } else if (parentSection.id === 'financial' || parentSection.id === 'finance-latest-section') {
            sectionId = 'financial';
        }
        console.log('Clicked section arrow for:', sectionId);
        if (sectionId) {
            showSectionView(sectionId);
        }
    }

    const searchIcon = document.querySelector('.search-icon');
    searchIcon.removeEventListener('click', handleSearchClick);
    searchIcon.addEventListener('click', handleSearchClick);

    function handleSearchClick(e) {
        e.preventDefault();
        showSearchView();
    }
}

fetch('DB.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('JSON data loaded:', data);
        articlesData = data.articles.map(article => ({
            ...article,
            region: article.category === 'World' ? 'Global' : 'National' // Example region assignment
        })) || [];
        if (articlesData.length === 0) {
            console.error('No articles found in JSON');
            alert('No articles found in JSON');
            return;
        }
        populateArticles();
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
        alert('Failed to load articles. Please ensure the JSON file is accessible and try again.');
    });

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        search();
    }
});