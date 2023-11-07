//轮播图
export const startWraper = (item) => {
  let wraper = document.querySelector(item)
  let ul = wraper.querySelector('ul')
  let num = ul.children.length;
  // let lis = ul.querySelectorAll('li')
  let step = wraper.clientWidth;
  let current = 0
  let sectionCurrentImage = document.querySelector('section p span:first-child')
  if (num > 1) {
    ul.style.left = '-100%'
    let timer = null
    let ol = document.createElement('ol')
    let left = document.createElement('span')
    let right = document.createElement('span')
    left.classList = 'left'
    right.classList = 'right'
    wraper.append(ol)
    wraper.append(left)
    wraper.append(right)
    ol = wraper.querySelector('ol')
    left = wraper.querySelector('.left')
    right = wraper.querySelector('.right')
    //复制元素
    let copyFirstAndLast = () => {
      let first = ul.children[0].cloneNode(true)
      let last = ul.children[num - 1].cloneNode(true)
      ul.append(first)
      ul.insertBefore(last, ul.children[0])
    }
    copyFirstAndLast()
    //添加小圆点
    let addCircle = () => {
      ol.innerHTML = ''
      let arr = []
      for (let i = 0; i < num; i++) {
        arr.push('<li></li>')
      }
      arr[0] = '<li class="current"></li>'
      ol.innerHTML = arr.join('')
    }
    addCircle()
    //定义缓动动画函数
    let animate = (obj, distance, callback) => {
      obj.timer = null
      let step = obj.offsetLeft > distance ? -1 : 1
      obj.timer = setInterval(() => {
        if (obj.offsetLeft !== distance) {
          obj.style.left = obj.offsetLeft + step + 'px'
        }
        else {
          clearInterval(obj.timer)
          callback && callback()
        }
      }, 1)
    }
    //回调函数
    let callback = () => {
      if (current == -1) {
        current = num - 1
        ul.style.left = -(num) * step + 'px'
      } else if (current == num) {
        current = 0;
        ul.style.left = -step + 'px'
      }
      isover = true
      //设置当前小圆点
      for (let i = 0; i < ol.children.length; i++) {
        ol.children[i].className = ''
      }
      ol.children[current].classList.add('current')
      if (sectionCurrentImage) sectionCurrentImage.textContent = current + 1
    }
    let isover = true
    //右滚动
    right.onclick = () => {
      if (isover) {
        isover = false
        current++
        animate(ul, -(current + 1) * step, callback)
      }
    }
    //左滚动
    left.onclick = () => {
      if (isover) {
        isover = false
        current--
        animate(ul, -(current + 1) * step, callback)
      }
    }
    //自动播放
    let autoPlay = () => {
      timer = setInterval(() => right.click(), 5000)
    }
    autoPlay()
    //拖动
    let ulStartX, touchStartX, moveX
    wraper.addEventListener('touchstart', (e) => {
      clearInterval(timer)
      ulStartX = ul.offsetLeft
      touchStartX = e.changedTouches[0].pageX
    })
    wraper.addEventListener('touchmove', (e) => {
      ul.style.left = ulStartX - touchStartX + e.changedTouches[0].pageX + 'px'
    })
    wraper.addEventListener('touchend', (e) => {
      moveX = e.changedTouches[0].pageX - touchStartX
      if (Math.abs(moveX) > 50) {
        if (moveX > 0) {
          left.click()
        }
        else {
          right.click()
        }
      } else {
        animate(ul, ulStartX, callback)
      }
      autoPlay()
    })
  }
}
//缓动动画
export const animate = (obj, dis, cb) => {
  obj.timer = null
  clearInterval(obj.timer)
  obj.timer = setInterval(function () {
    let step = (dis - obj.offsetLeft) / 10
    step = step > 0 ? Math.ceil(step) : Math.floor(step)
    if (obj.offsetLeft != dis) {
      obj.style.left = obj.offsetLeft + step + 'px'
    } else {
      clearInterval(obj.timer)
      obj.timer = null
      cb && cb()
    }
  }, 15)
}
//回到顶部
export const toTop = (cb) => {
  window.timer = null
  clearInterval(window.timer)
  window.timer = setInterval(function () {
    let step = (window.pageYOffset) / 10
    step = Math.ceil(step)
    if (window.pageYOffset != 0) {
      window.scroll(0, window.pageYOffset - step)
    } else {
      clearInterval(window.timer)
      window.timer = null
      cb && cb()
    }
  }, 15)
}
//节流函数
export function slowly (fn, time) {
  let isStart = true
  return function (...args) {
    if (isStart) {
      isStart = false
      setTimeout(() => {
        isStart = true
        fn.apply(this, args)
      }, time)
    }
  }
}
//防抖函数
export function noShake (param, time) {
  let timer = null
  return function (e) {
    clearTimeout(timer)
    timer = setTimeout(() => param.call(this, e), time)
  }
}
//拼接查询字符串
export const objToQuery = (obj) => {
  let arr = []
  for (const key in obj) {
    arr.push(key + '=' + obj[key])
  }
  return arr.join('&')
}
//封装ajax
export const myAjax = (obj) => {
  let newLink = new XMLHttpRequest()
  //请求超时
  // newLink.timeout = 30
  // newLink.ontimeout = function () {
  //     return alert('请求超时')
  // }
  let str = objToQuery(obj.data)
  if (obj.type.toUpperCase() === "GET") {
    if (!str) {
      newLink.open('GET', obj.url)
    }
    else {
      newLink.open('GET', obj.url + '?' + str)
    }
    newLink.send()
  }
  else if (obj.type.toUpperCase() === "POST") {
    newLink.open('POST', obj.url)
    newLink.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    newLink.send(str)
  } else if (obj.type.toUpperCase() === "FILE") {
    newLink.open('POST', obj.url)
    //添加进度条
    newLink.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        let num = Math.ceil(100 * e.loaded / e.total)
        console.log(num + '%');
      }
    }
    newLink.send(obj.data)
  }
  else if (obj.type.toUpperCase() === 'JSON') {
    newLink.open('POST', obj.url)
    newLink.setRequestHeader('Content-Type', 'application/json')
    let str = JSON.stringify(obj.data)
    newLink.send(str)
  }
  newLink.addEventListener('readystatechange', function () {
    if (newLink.readyState === 4 && newLink.status === 200) {
      obj.success(JSON.parse(newLink.responseText))
    }
  })
}
//简易模板引擎
export const mytemplate = (data, id) => {
  let newid = document.getElementById(id)
  let str = newid.innerHTML
  let regExp = /{{\s*([a-zA-Z]+)\s*}}/
  let abc = null
  while (abc = regExp.exec(str)) {
    str = str.replace(abc[0], data[abc[1]])
  }
  return str
}
//把一维数组变成二维数组
export const arrayToTwo = (arr, num) => {
  let newArr = []
  for (i = 0; i < Math.ceil(arr.length / num); i++) {
    newArr.push([])
  }
  arr.forEach((item, i) => {
    newArr[Math.floor(i / num)][i % num] = item
  })
  return newArr
}
//读取form表单数据
export const readFormData = (form) => {
  let form1 = document.querySelector(form)
  let arr = [...form1], arrdata = []
  arr.forEach(item => {
    if (item.name) {
      if (item.type == 'radio' || item.type == 'checkbox') {
        arrdata.push(`${item.name}=${item.checked}`)
      } else {
        arrdata.push(`${item.name}=${item.value}`)
      }
    }
  })
  return arrdata.join('&')
}
//跨域请求函数
export function jsonp (obj) {
  let cbName = 'fn' + Date.now().toString()
  let head = document.querySelector('head')
  let scr = document.createElement('script')
  // scr.src = obj.url + '?callback=' + cbName + '&' + objToQuery(obj.data)
  scr.src = `${obj.url}?${obj.callback ? obj.callback : 'callback'}=${cbName}&${objToQuery(obj.data)}`
  head.appendChild(scr)
  window[cbName] = function (res) {
    obj.success(res)
    delete window[cbName]
    head.removeChild(scr)
  }
}
//查询字符串变对象
export function strToObj (str) {
  let obj = {}
  let arr = str.split('&')
  arr.forEach(item => {
    let mid = item.split('=')
    obj[mid[0]] = mid[1]
  })
  return obj
}
//FormData数据转查询字符串
export function formDataToString (formdata) {
  let arr = []
  formdata.forEach((item, index) => {
    arr.push(`${index}=${item}`)
  })
  return arr.join('&')
}
//关闭窗口
export function closewin () {
  if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
    window.location.href = ""
    window.close();
  } else {
    window.opener = null;
    window.open("", "_self");
    window.close();
  }
}
// 生成节点树的函数
export function createTree (data, id) {
  var treeData = []
  data.forEach(item => {
    if (item.pid === id) { // 数据中有这一项数据再去找儿子
      var children = createTree(data, item.id)
      if (children.length > 0) item.children = children
      treeData.push(item)
    }
  })
  return treeData
}