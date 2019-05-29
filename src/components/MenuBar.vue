<template>
  <div class="menu-wrap">
	 <transition name="silde-up">
   <div class="bottom-wrapper"
	   v-show="ifTitleAndMenu"
		 :class="{active:isSettingShow || !ifTitleAndMenu}">
		 <span class="icon-menu icon" @click="showsetting(3)"></span>
     <span class="icon-progress icon" @click="showsetting(0)"></span>
		 <span class="icon-bright icon" @click="showsetting(1)"></span>
		 <span class="icon-a icon" @click="showsetting(2)">A</span>
	 </div>
	 </transition>

	 <!-- 设置 -->
	 <transition name="silde-up">
	 <div class="setting-wrap" v-show="isSettingShow">
		  <!-- 设置字体大小 -->
		 	<div class="setting-font-size" v-if="showTag === 2">
          <div class="preview minFont" 
					:style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
			    <div class="select-wrap">
						<div class="select"
						v-for="(item, index) in fontSizeList"
						:key = "index"
						 @click="selecFontSize(item.fontSize)"
						>
							<div class="line"></div>
							<div class="point-wrap">
									<div class="point"
							     v-show="item.fontSize == current">								
										<div class="smallpoint"></div>
									</div>
							</div>
							<div class="line"></div>
						</div>
					</div>

					<div class="preview maxFont" 
					:style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}"
				>A</div>
			 </div>

			<!-- 设置主题 -->
			<div class="setting-theme" v-else-if="showTag === 1">
			   <div class="setting-item" v-for="(item, index) in themeList" :key="index" @click="selectTheme(index)" >
					  <div class="theme-color"
						:style="{background:item.style.body.background}"
						></div>
						<div class="theme-text" :class="{'select':index === defaultTheme}">{{ item.name }}</div>
				 </div>
			</div> 
      <!-- 设置进度条 -->
      <div class="setting-progress" v-else-if="showTag === 0">
          <div class="progress-wrap">
					   <input class="progress" type="range"
						        max="100"
										min="0"
										step="1"
										@change="onProgressChange($event.target.value)"
										@input="onProgressInput($event.target.value)"
										:value="progress"
										:disabled="!bookAvailble"
										ref="progress"				
						 >	
					</div> 
					<div class="progress-text">
						 <span>{{bookAvailble ? progress + '%' : '加载中..' }}</span>
					</div>
			</div>
	 </div> 
	 </transition>

	 <!-- 目录 -->
	 <transition name="fade">
	   <div class="mask"
		  v-show="isShowContent" 
			@click="hidecontent"></div>
	 </transition> 
   <content-view 
					:isShowContent="isShowContent"
					v-show="isShowContent"
					:navigation="navigation"
					:bookAvailble="bookAvailble"
					@jumpTo="jumpTo"
	 ></content-view>
	</div>
</template>

<script>
import store from '@/store'
import ContentView from './contentView'
export default {
	store,
		components: {
     ContentView
	},
	props: {
    ifTitleAndMenu:{
			type:Boolean,
			default:false,
		},
		defaultTheme:Number,
		themeList:Array,
		bookAvailble:{
			type:Boolean,
			default:false,
		},
		curPercentage:Number,
		navigation:Object
	},

	data(){
	 return {
     isSettingShow:false,
		 isShowContent:false,
		 fontSizeList:[
			  {fontSize: 12},
				{fontSize: 14},
				{fontSize: 16},
				{fontSize: 18},
				{fontSize: 20},
				{fontSize: 22}
			],
			showTag:0,
			progress:0,
			
	 }
	},
	computed:{
		 current(){
      return store.state.defaultFontSize
    }
	},
	watch: {
		'curPercentage':{
			handler:function(val){  //handler最初绑定的时候就执行
				this.progress = val
				if(this.bookAvailble && this.$refs.progress){
					this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
				}
			},
			immediate: true
		}
	},
	methods: {
		showsetting(tag){	
			this.showTag = tag
			if(this.showTag === 3){
				this.isSettingShow = false
				this.isShowContent = true
			}else{
				this.isSettingShow = true
			}
		},
		selectTheme(index){
			this.$emit('setTheme',index)
		},
		hidesetting(){
			this.isSettingShow = false
		},
		hidecontent(){
      this.isShowContent = false
		},
	  selecFontSize(fontSize){
			store.commit('setFontSize', fontSize)
			this.$emit('setFont',fontSize)
		},
		onProgressInput(value){
			this.progress = value
			this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
		},
		onProgressChange(progress){
			 this.$emit('onProgressChange', progress)
		},
		jumpTo(target){
      this.$emit('jumpTo',target)
		}
	}
	
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global'; 
.menu-wrap{
  .bottom-wrapper{
  	position: absolute;
		left:0;
		bottom:0;
		background: #fff;
		z-index: 101;
		width: 100%;
		height: px2rem(48);
		display: flex;
		box-shadow: 0 -2px 2px rgba(0,0,0,0.15);
		&.active{
			box-shadow:none;
		}
		.icon{
			flex: 1;
			@include center;
			.icon-progress{
				font-size: px2rem(28);
			}
		  .icon-bright{
				font-size: px2rem(28);
			}
		}
	
	}
  .setting-wrap{
		 position: absolute;
		 left: 0;
		 bottom: px2rem(48);
		 z-index: 101;
		 width: 100%;
		 height: px2rem(60);
		 background: #fff;
		 box-shadow: 0 -2px 2px rgba(0,0,0,0.15);
		 .setting-font-size{
			 display: flex;
			 height: 100%;
			 align-items: center;
			.preview{
				flex:0 0 px2rem(30);
				@include center;
				position: absolute;
				&.minFont{
					left: calc(((100% - 60px) / 14 + 30px) / 2 - 20px);
				}
				&.maxFont{
					right: calc(((100% - 60px) / 14 + 30px) / 2 - 20px);
				}
			}

			.select-wrap{
				flex: 1;
				display: flex;	
				align-items: center;
			 .select{
				flex: 1;
				display: flex;
				align-items: center;
					.line{
						flex: 1;
						height: 0;
						border-top:px2rem(1) solid #ccc;
					}
					&:first-child{
						.line:first-child{
							border:none;
						}
					}
					&:last-child{
						.line:last-child{
							border:none;
						}
					}
					.point-wrap{
						flex: 0 0 0;
						width: 0;
						height: px2rem(7);
						border-left:px2rem(1) solid #ccc;
						position: relative;
						 .point{
								width: px2rem(16);
								height: px2rem(16);
								position: absolute;
								top:-8px;
								left:-8px;
								background: #fff;
								border-radius: 50%;
								border:1px solid #ccc;
								box-shadow: 0 0 8px rgba(0,0,0,0.15);
							  @include center;
							   .smallpoint{
                    width: px2rem(8);
							     	height: px2rem(8);
										background: #333;
							    	border-radius: 50%;
								 }
							}
					}				
		  	}
			}

		 }
		 .setting-theme{
			 display: flex;
			 height: 100%;
       .setting-item{
				 flex:1;
				 display: flex;
				 flex-direction: column;
				 box-sizing: border-box;
				 padding:px2rem(5);
				 .theme-color{
					 flex: 1;
					 border:1px solid #e7e7e7;
					 margin-bottom: px2rem(5); 
					 box-sizing: border-box;
				 }
				 .theme-text{
					 flex:0 0 px2rem(20);
					 font-size: px2rem(14);
					 color:#ccc;
					 text-align: center;
					 &.select{
						 color:#333;
					 }
				 }
			 }
		 }
		 .setting-progress{
			 position: absolute;
			 width:100%;
			 height: 100%;
			 .progress-wrap{
				 width:100%;
		   	 height: px2rem(38);   
				 padding:0 px2rem(30);
				 box-sizing: border-box;
				 @include center;
	
				 .progress{
					 width: 100%;
					 height: px2rem(2);
					 -webkit-appearance: none;
					 background: -webkit-linear-gradient(#999, #999) no-repeat #ddd;
					 background-size: 0 100%;
					 &:focus{
						 outline: none;
					 }
					 &::-webkit-slider-thumb{
						 -webkit-appearance: none;
						 width: px2rem(16);
						 height: px2rem(16);
						 border-radius: 50%;
						 background: #fff;
						 box-shadow: 0 4px 4px rgba(0,0,0,0.15);
						 border:px2rem(1) solid #ccc;
					 }
				 }
			 }
			  .progress-text{
						 @include center;
						 font-size: px2rem(14);
						
					 }
		 }
	}
	.mask{
		position: absolute;
		left:0;
		top:0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 101;
		display: flex;
	}
}
  
</style>
