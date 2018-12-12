---
layout: list
title: Nerd Factory AI Tech Blog Title
---

<div class="container post-list-area">
  {% for post in site.posts %}
  <div class="row">
    <div class="col-md border-bottom post-list">
      <div class="media">
        <div class="media-body">
          <a href="{{ post.url }}">
            <h2 class="mt-0 mb-3">{{ post.title }}</h2>
          </a>
          <p class="mb-3 post-content">{{ post.abstract | strip_html | truncatewords: 20 }}</p>
          <span class="post-info">{{ post.author }}</span>
          <span class="ml-2 mr-2 post-info">|</span>
          <span class="post-info">{{ post.date | date: "%Y-%m-%d" }}</span>
          <span class="ml-2 mr-2 post-info">|</span>
          {% for tag in post.tags %}
            <span class="badge badge-secondary">#{{ tag }}</span>
          {% endfor %}
        </div>
        {% if post.image %}
          <img class="ml-5 post-thumbnail" src="{{ post.image }}" alt="썸네일.">
        {% else %}
          <img class="ml-5 post-thumbnail" src="/assets/images/thumbnails/empty-1.png" alt="포스트에 이미지가 없습니다.">
        {% endif %}
        
      </div>
    </div>
  </div>
  {% endfor %}
</div>

<div class="container-fluid post-list-area-mobile">
  {% for post in site.posts %}
  <div class="row post-list border-bottom">
    <div class="col-md">
        {% if post.image %}
          <img class="post-thumbnail" src="{{ post.image }}" alt="썸네일.">
        {% else %}
          <img class="post-thumbnail" src="/assets/images/thumbnails/empty-1.png" alt="포스트에 이미지가 없습니다.">
        {% endif %}
    </div>
    <div class="col-md">
      <div>
        <a href="{{ post.url }}">
          <h2 class="mt-0 mb-3">{{ post.title }}</h2>
        </a>
      </div>
      <div>
        <p class="mb-3 post-content">{{ post.abstract | strip_html | truncatewords: 20 }}</p>
      </div>
      <div>
        <span class="post-info">{{ post.author }}</span>
        <span class="ml-2 mr-2 post-info">|</span>
        <span class="post-info">{{ post.date | date: "%Y-%m-%d" }}</span>
      </div>
      <div>
        {% for tag in post.tags %}
          <span class="badge badge-secondary">#{{ tag }}</span>
        {% endfor %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>