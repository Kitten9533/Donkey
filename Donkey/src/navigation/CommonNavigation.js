import React, {
	Component
} from 'react'
import {
	StyleSheet,
	View,
	Text,
	Button,
	Image,
	TouchableOpacity
} from 'react-native';
import Colors from '../constants/Colors';
import TabNavigation from '../navigation/TabNavigation';
import {
	StackNavigator,
	TabNavigator
} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Other from '../pages/Other';
import Sub from '../pages/Sub';
import MvPlayer from '../components/MvPlayer';
import LeftUserInfo from '../pages/LeftUserInfo';
// import MainPageNavigation from '../navigation/MainPageNavigation';

// const MainPage = ({navigation}) => (
// 	<TabNavigation/>
// )

////这个MainPage不需要了，直接在 TabNavigation 中添加navigationOptions即可
// class MainPage extends React.Component{
// 	static navigationOptions = props => {
// 		const {navigation} = props;
// 		return {
// 			headerTitle: 'HOME PAGE', //标题
// 		    headerTitleStyle: { //标题字体
// 		  		color: Colors.navigation,
// 	      	},
// 		   	headerStyle: { //标题样式
// 		   		backgroundColor: Colors.grass,
// 		   	},
// 		   	headerLeft: (
// 		   		<TouchableOpacity
// 		   			onPress={() => navigation.navigate('DrawerOpen')}
// 		   			>
// 			   		<Image
// 				   	    source={require('../assets/content.png')}
// 				        style={styles.icon}
// 			    	/>
// 			    </TouchableOpacity>
// 		   	),
// 		   	headerRight: (
// 		   		<Text style={styles.headerRightText}
// 		   			onPress={() => navigation.navigate('Other')}
// 		   			>
// 		   			Go
// 		   		</Text>
// 		    ),
// 		}
// 	};
// 	render(){
// 		return (
// 			<TabNavigation navigation={this.props.screenProps} />
// 			)
// 	}
// }

//跳转过渡效果
//forHorizontal:从右向左进入、forVertical:从下向上进入、forFadeFromBottomAndroid:从底部淡出。
const TransitionConfiguration = () => ({
	screenInterpolator: (sceneProps) => {
		const {
			scene
		} = sceneProps;
		const {
			route
		} = scene;
		const params = route.params || {};
		const transition = params.transition || 'forHorizontal';
		return CardStackStyleInterpolator[transition](sceneProps);
	},
});

const CommonNavigation = StackNavigator({
	Other: {
		screen: Other,
	},
	// MainPage: {
	// 	screen: MainPage,
	// },
	TabNavigation: {
		screen: TabNavigation,
	},
	Sub: {
		screen: Sub,
	},
	LeftUserInfo: {
		screen: LeftUserInfo,
	},
	MvPlayer: {
		screen: MvPlayer,
	},
}, {
	initialRouteName: 'TabNavigation',
	navigationOptions: {
		headerTitleStyle: { //标题字体
			color: Colors.navigation,
		},
		headerStyle: {
			backgroundColor: Colors.grass,
			height: 50,
		},
		cardStyle: {
			backgroundColor: Colors.navigation,
			color: 'red',
		},
		//返回箭头的颜色
		headerTintColor: Colors.navigation,
		transitionConfig: TransitionConfiguration,
	},
})

const styles = StyleSheet.create({
	icon: {
		width: 24,
		height: 24,
		marginLeft: 20,
		marginRight: 8,
	},
	headerRightText: {
		color: Colors.textWhite,
		fontSize: 18,
		marginRight: 20,
	}
})

export default CommonNavigation