<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
.main-container {
  width: 100%;
  height: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-container {
  width: 595px;
  height: max-content;
  padding: 20px;
}

.text-overflow-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-overflow-hidden-2 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.main-title {
  width: 100%;
  text-align: center;
}

.header-info {
  justify-content: space-between;
}

#label,
#address,
#name,
#time {
  font-weight: bold;
  font-size: 10px;
}

#name {
  margin-right: 10px;
}

.header-1 {
  width: 10%;
}

.header-2 {
  width: 70%;
}

.header-3 {
  width: 20%;
}

.item-1 {
  width: 10%;
  border-right: 1px #a8a8a8 solid;
  text-align: center;
}

.item-2 {
  width: 70%;
  padding-left: 5px;
  border-right: 1px #a8a8a8 solid;
}

.item-3 {
  width: 20%;
  text-align: center;
}

.flex-center {
  display: flex;
  align-items: center;
}

.mihuo-applet {
  width: 70px;
  height: 70px;
  position: absolute;
  margin-left: 520px;
  margin-top: 0px;
}

.mihuo-seal {
  width: 140px;
  height: 140px;
  position: absolute;
  margin-left: 450px;
  margin-top: -100px;
}

.download-time {
  width: 50%;
  text-align: right;
  font-size: 10px;
}

.mihuo-text {
  width: 50%;
  text-align: left;
  font-size: 10px;
}

.mihuo-footer {
  width: 100%;
  margin-top: 10px;
}

.mihuo-logo {
  position: absolute;
  width: 100px;
  margin-top: 18px;
}

.item-img {
  width: 100px;
  height: 100px;
}
</style>
