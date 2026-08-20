---
title: "{{ replace .Name "-" " " | title }}"
content_type: "Sivu"
page_template: "default"
url: "/sivut/{{ urlize .Name }}/"
date: {{ .Date }}
draft: true
showInMenu: false
showInFooter: false
showContactForm: false
showPeople: false
showManufacturers: false
---
