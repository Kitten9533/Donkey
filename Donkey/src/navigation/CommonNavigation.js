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
import Other from '../pages/Other';
import Sub from '../pages/Sub';
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