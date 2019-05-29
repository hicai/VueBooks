<template>
  <div>
	 <transition name="silde-down">
	 <div class="top-wrapper" v-show="ifTitleAndMenu">
		 <div class="left">
			 <span class="icon-back icon"></span>
		 </div>
		 <div class="right">	
				 <span class="icon-person icon"></span>	
				 <span class="icon-cart icon"></span>
				 <span class="icon-more icon"></span>
		 </div>
	 </div>
	 </transition>
	</div>
</template>

<script>
export default {
		props: {
    ifTitleAndMenu:{
			type:Boolean,
			default:false
		}
	},
	data(){
	 return {

	 }
	}
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global'; 
.top-wrapper{
		position: absolute;
		top:0;
		left:0;
		background: #fff;
		z-index: 101;
		width: 100%;
		height: px2rem(48);
		display: flex;
		box-shadow: 0 2px 2px rgba(0,0,0,0.15);
	.left{	
		flex:0 0 px2rem(40);
		@include center;
	}
	.right{
		flex:1;
		display: flex;
		justify-content: flex-end;
		.icon{
			flex: 0 0 px2em(40);
			@include center;
			.icon-person{
				font-size: px2rem(24);
			}
			.icon-cart{
				font-size: px2rem(24);
			}
			
		}
	}
	
}
</style>
