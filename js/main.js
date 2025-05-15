document.addEventListener('DOMContentLoaded', function() {
    // YouTube Thumbnail Downloader (Fully Working)
    document.querySelectorAll('.get-thumbnails').forEach(button => {
        button.addEventListener('click', function() {
            const url = this.parentElement.querySelector('.yt-url').value.trim();
            if (!url) {
                showError(this.parentElement.querySelector('.thumbnails-result'), "Please enter a YouTube URL");
                return;
            }
            
            let videoId = extractVideoId(url);
            if (!videoId) {
                showError(this.parentElement.querySelector('.thumbnails-result'), "Invalid YouTube URL");
                return;
            }
            
            const thumbnails = [
                { name: 'Max Resolution (1280x720)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, code: 'maxres' },
                { name: 'High Quality (480x360)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, code: 'hq' },
                { name: 'Medium Quality (320x180)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, code: 'mq' },
                { name: 'Standard Quality (640x480)', url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, code: 'sd' },
                { name: 'Default Thumbnail (120x90)', url: `https://img.youtube.com/vi/${videoId}/default.jpg`, code: 'default' }
            ];
            
            showThumbnails(this.parentElement.querySelector('.thumbnails-result'), thumbnails, videoId);
        });
    });
    
    // Channel Logo Fetcher (Works with Channel ID URLs)
    document.querySelectorAll('.get-logo').forEach(button => {
        button.addEventListener('click', function() {
            const url = this.parentElement.querySelector('.yt-url').value.trim();
            if (!url) {
                showError(this.parentElement.querySelector('.logo-result'), "Please enter a YouTube URL");
                return;
            }
            
            if (url.includes('youtube.com/channel/')) {
                const channelId = url.split('youtube.com/channel/')[1].split('/')[0].split('?')[0];
                showChannelLogo(this.parentElement.querySelector('.logo-result'), channelId);
            } else {
                showError(this.parentElement.querySelector('.logo-result'), 
                    "Please use channel ID URL format: https://www.youtube.com/channel/UCXXXX...");
            }
        });
    });
    
    // Instagram Tools - Redirect to Instagram
    document.querySelectorAll('.get-profile-pic, .get-post-thumbnail, .get-profile').forEach(button => {
        button.addEventListener('click', function() {
            let url, username;
            if (this.classList.contains('get-profile-pic') || this.classList.contains('get-profile')) {
                username = this.parentElement.querySelector('.ig-username').value.trim();
                if (!username) {
                    showError(this.parentElement.querySelector('.profile-pic-result, .profile-result'), 
                        "Please enter Instagram username");
                    return;
                }
                url = `https://www.instagram.com/${username}/`;
            } else {
                url = this.parentElement.querySelector('.ig-url').value.trim();
                if (!url.includes('instagram.com')) {
                    showError(this.parentElement.querySelector('.post-thumbnail-result'), 
                        "Please enter valid Instagram URL");
                    return;
                }
            }
            
            // Open in new tab
            window.open(url, '_blank');
            
            // Show message
            const resultElement = this.parentElement.querySelector('.profile-pic-result, .post-thumbnail-result, .profile-result');
            resultElement.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-external-link-alt me-2"></i>
                    Instagram doesn't allow direct access. We've opened the profile in a new tab.
                    <div class="mt-2">You can right-click on the profile picture and select "Save image as"</div>
                </div>`;
        });
    });
    
    // Helper Functions
    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    function showThumbnails(element, thumbnails, videoId) {
        let html = '<h6>Available Thumbnails:</h6><div class="row g-3">';
        
        thumbnails.forEach(thumb => {
            html += `
            <div class="col-md-6">
                <div class="card h-100">
                    <img src="${thumb.url}" class="card-img-top" 
                         alt="${thumb.name}" 
                         onerror="this.parentNode.parentNode.style.display='none'">
                    <div class="card-body">
                        <h6 class="card-title">${thumb.name}</h6>
                        <div class="d-flex gap-2">
                            <a href="${thumb.url}" class="btn btn-sm btn-danger" download="yt-thumbnail-${videoId}-${thumb.code}.jpg">
                                <i class="fas fa-download me-1"></i> Download
                            </a>
                            <button class="btn btn-sm btn-outline-secondary copy-btn" data-url="${thumb.url}">
                                <i class="fas fa-copy me-1"></i> Copy URL
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        
        html += `</div>
            <div class="alert alert-info mt-3">
                <i class="fas fa-info-circle me-2"></i>
                If some thumbnails don't appear, it means they're not available for this video.
            </div>`;
        
        element.innerHTML = html;
        
        // Add copy functionality
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                navigator.clipboard.writeText(url).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            });
        });
    }
    
    function showChannelLogo(element, channelId) {
        // Note: This only works for some channels
        const logoUrl = `https://yt3.googleusercontent.com/ytc/${channelId}`;
        
        const html = `
        <div class="card">
            <div class="card-body text-center">
                <img src="${logoUrl}" class="rounded-circle" 
                     style="width: 150px; height: 150px; object-fit: cover;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/150?text=Logo+Not+Available'">
                <div class="mt-3">
                    <a href="${logoUrl}" class="btn btn-sm btn-danger" download="yt-channel-${channelId}-logo.jpg">
                        <i class="fas fa-download me-1"></i> Download Logo
                    </a>
                    <div class="alert alert-warning mt-3">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        This works for some channels only. For others, you'll see a placeholder.
                    </div>
                </div>
            </div>
        </div>`;
        
        element.innerHTML = html;
    }
    
    function showError(element, message) {
        element.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
    
    // Simulated Data Tools (No API)
    document.querySelectorAll('.get-tags, .get-stats, .get-analysis, .get-insights, .get-hashtags').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.yt-url, .ig-username, .ig-url').value.trim();
            if (!input) {
                const resultElement = this.parentElement.querySelector('.tags-result, .stats-result, .analysis-result, .insights-result, .hashtags-result');
                showError(resultElement, "Please enter a valid URL/username");
                return;
            }
            
            // Show loading
            const resultElement = this.parentElement.querySelector('.tags-result, .stats-result, .analysis-result, .insights-result, .hashtags-result');
            resultElement.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary"></div></div>`;
            
            // Simulate API delay
            setTimeout(() => {
                if (this.classList.contains('get-tags')) {
                    showSimulatedTags(resultElement);
                } else if (this.classList.contains('get-stats')) {
                    showSimulatedStats(resultElement);
                } else if (this.classList.contains('get-analysis')) {
                    showSimulatedAnalysis(resultElement);
                } else if (this.classList.contains('get-insights')) {
                    showSimulatedInsights(resultElement, input);
                } else if (this.classList.contains('get-hashtags')) {
                    showSimulatedHashtags(resultElement);
                }
            }, 800);
        });
    });
    
    function showSimulatedTags(element) {
        const fakeTags = ['youtube', 'video', 'tutorial', '2023', 'howto', 'tips', 'education', 'learning', 'free', 'online'];
        
        let html = '<h6>Extracted Tags:</h6><div class="d-flex flex-wrap gap-2 mb-3">';
        fakeTags.forEach(tag => {
            html += `<span class="badge bg-secondary">${tag}</span>`;
        });
        html += `</div>
            <button class="btn btn-sm btn-outline-dark copy-btn" data-text="${fakeTags.join(', ')}">
                <i class="fas fa-copy me-1"></i> Copy All Tags
            </button>
            <div class="alert alert-info mt-3">
                <i class="fas fa-info-circle me-2"></i>
                In a real implementation, this would extract actual tags from YouTube API.
            </div>`;
        
        element.innerHTML = html;
        setupCopyButtons();
    }
    
    function showSimulatedStats(element) {
        const fakeStats = {
            views: Math.floor(Math.random() * 10000000).toLocaleString(),
            likes: Math.floor(Math.random() * 500000).toLocaleString(),
            comments: Math.floor(Math.random() * 10000).toLocaleString(),
            engagement: (Math.random() * 10 + 2).toFixed(2) + '%',
            published: `${Math.floor(Math.random() * 30)} days ago`
        };
        
        const html = `
        <h6>Video Statistics:</h6>
        <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Views
                <span class="badge bg-primary rounded-pill">${fakeStats.views}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Likes
                <span class="badge bg-success rounded-pill">${fakeStats.likes}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Comments
                <span class="badge bg-info rounded-pill">${fakeStats.comments}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Engagement Rate
                <span class="badge bg-warning rounded-pill">${fakeStats.engagement}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Published
                <span class="badge bg-secondary rounded-pill">${fakeStats.published}</span>
            </li>
        </ul>
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            These are simulated statistics. Real implementation would require YouTube API.
        </div>`;
        
        element.innerHTML = html;
    }
    
    function showSimulatedAnalysis(element) {
        const fakeAnalysis = {
            title: "How to Build a Website - Complete Tutorial 2023",
            titleLength: 42,
            description: "In this video, I'll show you how to build a complete website from scratch using HTML, CSS, and JavaScript. Perfect for beginners! Don't forget to like and subscribe for more web development tutorials.",
            descriptionLength: 210,
            keywords: ["build", "website", "tutorial", "2023", "html", "css", "javascript"],
            seoSuggestions: [
                "Consider adding more specific keywords to your title",
                "Your description could be more concise",
                "Include a call-to-action in the first 3 lines of your description"
            ]
        };
        
        let html = `
        <h6>Title Analysis:</h6>
        <p><strong>Title:</strong> ${fakeAnalysis.title}</p>
        <p><strong>Character Count:</strong> ${fakeAnalysis.titleLength} (Recommended: under 60)</p>
        
        <h6 class="mt-3">Description Analysis:</h6>
        <p><strong>Character Count:</strong> ${fakeAnalysis.descriptionLength} (Recommended: 200-300)</p>
        
        <h6 class="mt-3">Keyword Density:</h6>
        <div class="d-flex flex-wrap gap-2 mb-3">`;
        
        fakeAnalysis.keywords.forEach(keyword => {
            html += `<span class="badge bg-secondary">${keyword}</span>`;
        });
        
        html += `</div>
        <h6>SEO Suggestions:</h6>
        <ul class="list-group mb-3">`;
        
        fakeAnalysis.seoSuggestions.forEach(suggestion => {
            html += `<li class="list-group-item">${suggestion}</li>`;
        });
        
        html += `</ul>
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            This is simulated analysis. Real implementation would require YouTube API.
        </div>`;
        
        element.innerHTML = html;
    }
    
    function showSimulatedInsights(element, username) {
        const fakeInsights = {
            username: username,
            posts: Math.floor(Math.random() * 1000),
            followers: Math.floor(Math.random() * 1000000).toLocaleString(),
            following: Math.floor(Math.random() * 1000),
            engagement: (Math.random() * 10 + 2).toFixed(2) + '%',
            lastPost: `${Math.floor(Math.random() * 30)} days ago`
        };
        
        const html = `
        <h6>Basic Insights for @${fakeInsights.username}:</h6>
        <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Posts
                <span class="badge bg-primary rounded-pill">${fakeInsights.posts}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Followers
                <span class="badge bg-success rounded-pill">${fakeInsights.followers}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Following
                <span class="badge bg-info rounded-pill">${fakeInsights.following}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Engagement Rate
                <span class="badge bg-warning rounded-pill">${fakeInsights.engagement}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Last Post
                <span class="badge bg-secondary rounded-pill">${fakeInsights.lastPost}</span>
            </li>
        </ul>
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            These are simulated insights. Real implementation would require Instagram API.
        </div>`;
        
        element.innerHTML = html;
    }
    
    function showSimulatedHashtags(element) {
        const fakeHashtags = ['instagram', 'photography', 'love', 'instagood', 'follow', 'like', 'socialmedia', 'trending', 'viral'];
        
        let html = '<h6>Extracted Hashtags:</h6><div class="d-flex flex-wrap gap-2 mb-3">';
        fakeHashtags.forEach(tag => {
            html += `<span class="badge bg-secondary">#${tag}</span>`;
        });
        html += `</div>
            <button class="btn btn-sm btn-outline-dark copy-btn" data-text="${fakeHashtags.map(t => `#${t}`).join(' ')}">
                <i class="fas fa-copy me-1"></i> Copy All Hashtags
            </button>
            <div class="alert alert-info mt-3">
                <i class="fas fa-info-circle me-2"></i>
                In a real implementation, this would extract actual hashtags from the post.
            </div>`;
        
        element.innerHTML = html;
        setupCopyButtons();
    }
    
    function setupCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.getAttribute('data-text');
                navigator.clipboard.writeText(text).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            });
        });
    }
});
