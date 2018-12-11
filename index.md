---
layout: list
title: Nerd Factory AI Tech Blog Title
---

<div class="container">
  {% for post in site.posts %}
  <div class="row">
    <div class="col-lg border-bottom post-list">
      <div class="media">
        <div class="media-body">
          <a href="{{ post.url }}">
            <h3 class="mt-0 mb-1">{{ post.title }}</h3>
          </a>
          <p class="post-content">{{ post.excerpt }}</p>
          <span class="post-info">{{ post.author }}</span>
          <span class="ml-2 mr-2 post-info">|</span>
          <span class="post-info">{{ post.date | date: "%Y-%m-%d" }}</span>
          <span class="ml-2 mr-2 post-info">|</span>
          <span class="badge badge-secondary">{{ post.categories }}</span>
        </div>
        <img class="ml-3 post-thumbnail" src="assets/images/thumbnails/empty-1.png" alt="포스트에 이미지가 없습니다.">
      </div>
    </div>
  </div>
  {% endfor %}
</div>