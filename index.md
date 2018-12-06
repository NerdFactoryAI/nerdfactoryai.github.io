---
layout: list
title: Nerd Factory AI Tech Blog Title
---

<div class="container">
  {% for post in site.posts %}
  <div class="row">
    <div class="col-lg">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </div>
  </div>
  {% endfor %}
</div>