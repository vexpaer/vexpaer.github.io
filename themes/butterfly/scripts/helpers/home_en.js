/**
 * Vexpaer
 * 主页是纯英文的：导航菜单、最近文章标题和标签在主页上换成英文显示，其余页面不受影响。
 */

'use strict'

const MENU = {
  主页: 'Home',
  博客: 'Blog',
  档: 'Archives',
  归档: 'Archives',
  标签: 'Tags',
  分类: 'Categories',
  探索: 'Explore',
  影游陈列: 'Screen & Play',
  书籍: 'Books',
  友链: 'Links',
  关于: 'About'
}

const SUBJECTS = {
  细胞生物学: 'Cell Biology',
  生物化学: 'Biochemistry',
  生物力学: 'Biomechanics',
  组织工程: 'Tissue Engineering',
  生理学: 'Physiology',
  解剖学: 'Anatomy',
  生物: 'Biology',
  化学: 'Chemistry',
  有机化学: 'Organic Chemistry',
  无机化学: 'Inorganic Chemistry',
  物理: 'Physics',
  大学物理: 'College Physics',
  数学: 'Mathematics',
  英语: 'English',
  语文: 'Chinese',
  毕业: 'Graduation',
  middleSchool: 'Middle School',
  undergraduate: 'Undergraduate',
  picture: 'Gallery'
}

const CJK = /[㐀-鿿]/

hexo.extend.helper.register('vexpaer_en_menu', function (label) {
  const name = String(label).trim()
  return MENU[name] || name
})

hexo.extend.helper.register('vexpaer_en_tag', function (name) {
  if (!name) return ''
  if (SUBJECTS[name]) return SUBJECTS[name]
  return CJK.test(name) ? '' : name
})

// “生物力学_Bone” → “Biomechanics · Bone”；没有英文部分的中文标题按学科显示为 “Chemistry notes”。
hexo.extend.helper.register('vexpaer_en_title', function (post) {
  const title = String(post.title || '').trim()
  if (!title) return 'Untitled'
  if (!CJK.test(title)) return title
  const course = title.match(/^(.+?)_(.+)$/)
  if (course && SUBJECTS[course[1]] && !CJK.test(course[2])) return SUBJECTS[course[1]] + ' · ' + course[2].trim()
  if (SUBJECTS[title]) return SUBJECTS[title]
  const tags = post.tags ? post.tags.map(tag => tag.name) : []
  const subject = tags.map(tag => SUBJECTS[tag]).find(name => name && !/School|Undergraduate|Gallery/.test(name))
  return subject ? subject + ' notes' : 'Notes'
})
