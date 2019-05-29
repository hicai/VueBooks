<template>
  <div class="ebook">
   <!--顶部菜单栏 -->
   <title-bar :ifTitleAndMenu="ifTitleAndMenu" ref="titleBar"></title-bar>
	 <!-- 电子书展示区 -->
   <div class="read-wrapper">
     <div id="read"></div>
		 <!--控制菜单栏 -->
		 <div class="layer">
				  <div class="left" @click="prevPage" ></div>
					<div class="center" @click="showMenu"></div>
					<div class="right" @click="nextPage"></div> 
			</div>
	 </div>

   <!--底部菜单栏 -->
	 <menu-bar 
	 :ifTitleAndMenu="ifTitleAndMenu" 
	 :defaultTheme="defaultTheme"
	 :themeList="themeList"
	 :bookAvailble="bookAvailble"
	 :curPercentage="curPercentage"
	 :navigation="navigation"
	 @setFont = "setFont"
   @setTheme = "setThemeSave"
	 @jumpTo="jumpTo"
	 ref="menuBar"></menu-bar>
	</div>
</template>

<script>
import store from '@/store'
import Epub from 'epubjs';
import TitleBar from '../components/TitleBar'
import MenuBar from '../components/MenuBar'
import { constants } from 'zlib';

//电子书路径
const DOWNLOAD_URL = '/ebook.epub';
global.epub = Epub;
export default {
	name:'ebook',
	store,
	components: {
		TitleBar,
		MenuBar
	},
	data(){
	 return {
	 ifTitleAndMenu:false,//设置栏是否显示
     themeList:[//主题选项
			 {
				 name:'default',
				 style:{
					 body:{
					  'color':'#000',
            'background':'#fff'
					 }
				 }
			 },
			 {
				 name:'eye',
				 style:{
					 body:{
					  'color':'#000',
            'background':'#cddabc'
					 }
				 }
			 },
			 {
				 name:'night',
				 style:{
					 body:{
					  'color':'#fff',
            'background':'#232323'
					 } 
				 }
			 },
			 {
				 name:'gold',
				 style:{
					 body:{
					  'color':'#000',
            'background':'#f0edd8'
					 }
				 }
			 }			 			 
		 ],
		 defaultTheme:0, //默认主题设置
		 bookAvailble:false,//电子书是否假装完
		 curPercentage:0, //进度条初始位置
		 navigation:{}, //电子书目录
	 }
	},
	methods: {

	//字体大小设置
	setFont(fontSize){
		if(this.themes){
				store.state.defaultFontSize = fontSize
				this.themes.fontSize(fontSize + 'px')
			}
		},
		
	//主题设置
	setTheme(){
    this.themeList.forEach(element => {
		this.themes.register(element.name, element.style)
         });
		},

	//选择主题后保存
	setThemeSave(index){
			this.themes.select(this.themeList[index].name)
			this.defaultTheme = index
	},

	//进度条跳转
	onProgressChange(progress){
		const percentage = progress / 100
		const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
		this.rendition.display(location)
	},
	
	//翻页触发进度条
  onLocationChange() {
		  //获取当前位置
			const curLocation = this.rendition.currentLocation()
			//获取当前进度条百分比
			this.curPercentage = this.bookAvailble ? this.locations.percentageFromCfi(curLocation.start.cfi) : 0
			//转换成1-100数字
			this.curPercentage = Math.round(this.curPercentage * 100)
			},

  //菜单栏显隐
    showMenu(){
			this.ifTitleAndMenu = !this.ifTitleAndMenu
			if(!this.ifTitleAndMenu){
        this.$refs.menuBar.hidesetting()
			}
		}, 

		//电子书解析渲染
		showEpub(){
			//生成book对象
		 this.book = new Epub(DOWNLOAD_URL) //切记把路径放对象里面
		  console.log(this.book)
			//通过renderTo()生成rendition对象，read为挂载的dom
			this.rendition = this.book.renderTo('read', {
				width:window.innerWidth,
				height:window.innerHeight
			})
			//通过rendition.display()渲染电子书
			this.rendition.display()
			
			//获取theme对象
			this.themes = this.rendition.themes
			
			//获取默认字体
			this.setFont(store.state.defaultFontSize)

			//获取主题
			this.setTheme()
			this.setThemeSave(this.defaultTheme)

			//获取Locations对象，通过epub.js的钩子函数来实现
      this.book.ready.then(() => {
				//获取目录信息
				this.navigation = this.book.navigation
				//console.log(this.navigation)

				//获取电子书当前位置
				return this.book.locations.generate()
			}).then(result => {
				 this.locations = this.book.locations
				 this.bookAvailble = true
				
			})
			
			//修改封面图片大小
			this.rendition.hooks.render.register(view => {
				const contents = this.rendition.manager.getContents()[0]
				contents.addStylesheet('../assets/styles/test')
			})
		 },

	  	//左右翻页
			prevPage(){
				if(this.rendition){
					this.rendition.prev().then(()=>{
					  this.onLocationChange()
				  
					})		
				}
			},
			nextPage(){
				if (this.rendition) {
				this.rendition.next().then(()=>{
			  	this.onLocationChange()
				})		
				}
			},

		 // 目录跳转指定位置
		 jumpTo(href){
			this.rendition.display(href).then(()=>{
				this.onLocationChange()				
			})
			this.hideTitleAndMenu()
		},

		//点击目录跳转，隐藏设置栏及目录
    hideTitleAndMenu(){
		 this.ifTitleAndMenu = false
		 this.$refs.menuBar.hidesetting()
		 this.$refs.menuBar.hidecontent() 
	   },


	},
	mounted() {
		this.showEpub()
  	}
		
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global'; 
.ebook{
	position: relative;
.read-wrapper{
  	position: relative;
	.layer{
		z-index: 100;
		position: absolute;
   	width: 100%;
		height: 100%;
		top: 0;
		left: 0; 
		display: flex;
		.left{
			flex:0 0 px2rem(100);
			
		}
		.center{
			flex:1;
		}
		.right{
			flex:0 0 px2rem(100);
		}
  	}
	}
}
</style>
