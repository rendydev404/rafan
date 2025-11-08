$(document).ready(function () {
    const newsContainer = $('#news-container');
    const searchInput = $('#search-input');
    const searchButton = $('#search-button');
    const loader = $('#loader');
    const readMoreBtn = $('#read-more-btn');

    let allArticles = [];
    let visibleArticlesCount = 0;
    const articlesPerLoad = 6;

    const fetchNews = (query) => {
        loader.removeClass('d-none').addClass('d-flex');
        newsContainer.hide();
        readMoreBtn.addClass('d-none');

        $.ajax({
            url: `/api/news?q=${query}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                allArticles = data.articles.filter(article => article.title && article.description);
                visibleArticlesCount = 0;
                newsContainer.empty();
                displayNews();
            },
            error: function (error) {
                console.error("Error fetching news:", error);
                newsContainer.html(`<p class="text-center fs-4">Gagal memuat berita. ${error.statusText}</p>`);
            },
            complete: function () {
                loader.removeClass('d-flex').addClass('d-none');
                newsContainer.show();
            }
        });
    };

    const displayNews = () => {
        const articlesToDisplay = allArticles.slice(visibleArticlesCount, visibleArticlesCount + articlesPerLoad);

        if (allArticles.length === 0 && visibleArticlesCount === 0) {
            newsContainer.html('<p class="text-center fs-4">Tidak ada berita yang ditemukan.</p>');
            readMoreBtn.addClass('d-none');
            return;
        }

        articlesToDisplay.forEach(article => {
            const placeholderImage = 'https://via.placeholder.com/400x250.png?text=No+Image';
            const newsCard = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${article.urlToImage || placeholderImage}" class="card-img-top" alt="News Image">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text flex-grow-1">${article.description}</p>
                            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary mt-auto">Baca Selengkapnya</a>
                        </div>
                    </div>
                </div>
            `;
            newsContainer.append(newsCard);
        });

        visibleArticlesCount += articlesToDisplay.length;

        if (visibleArticlesCount < allArticles.length) {
            readMoreBtn.removeClass('d-none');
        } else {
            readMoreBtn.addClass('d-none');
        }
    };

    readMoreBtn.on('click', displayNews);

    searchButton.on('click', () => {
        const query = searchInput.val().trim();
        if (query) {
            fetchNews(query);
            $('.category-link').removeClass('active');
        }
    });

    searchInput.on('keydown', (event) => {
        if (event.key === 'Enter') {
            searchButton.trigger('click');
        }
    });

    $('.category-link').on('click', function (e) {
        e.preventDefault();
        $('.category-link').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('category');
        fetchNews(category);
    });

    fetchNews('indonesia');
});