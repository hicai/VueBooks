<template>
   <transition name="silde-right">
     <div class="content">
       <div class="content-list" v-if="bookAvailble">
         <div class="content-item"
				   v-for="(item, index) in navigation.toc"
					 :key="index"
					 @click="jumpTo(item.href)"
				 >
				   <span>{{ item.label }}</span>
				 </div> 
			 </div>
			 <div class="empty" v-else>
				 加载中...
			 </div>
		 </div>
	 </transition>
</template>

<script>
export default {
	props: {
		isShowConten:Boolean,
		bookAvailble:Boolean,
		navigation:Object,
		curPercentage:Number  
	},
	methods: {
		jumpTo(target){
			this.$emit('jumpTo',target);	
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global'; 
.content{
	position: absolute;
	width: 80%;
	height: 100%;
	top:0;
	left: 0;
	z-index: 102;
	background: #fff;
	.content-list{
		width: 100%;
		height: 100%;
		overflow: auto;
		.content-item{
			padding: px2rem(20) px2rem(15);
			border-bottom: px2rem(1) solid #f4f4f4;
			@include center;
			font-size: px2rem(14);
		}
	}
	.empty{
		width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(16);
      color: #333;
	}
}

</style>
