import React, {
	Component
} from 'react'
import {
	StyleSheet,
	View,
	Text,
	Button,
	TouchableOpacity,
	Image,
} from 'react-native'
import Colors from '../constants/Colors';
import {TabNavigator} from 'react-navigation';
import First from '../pages/First';
import Second from '../pages/Second';
import Third from '../pages/Third';

const TabNavigation = TabNavigator({
	First: {
		screen: First,
		navigationOptions: {
			title: 'First',
		},
	},
	Second: {
		screen: Second,
		navigationOptions: {
			title: 'Second',
		},
	},
	Third: {
		screen: Third,
		navigationOptions: {
			title: 'Third',
		},
	},
},{
	initialRouteName: 'First',
	tabBarPosition: 'top',
	tabBarOptions: {
		style: {
		    backgroundColor: Colors.navigation,
    	},
    	tabStyle: {//View
    		
    	},
    	labelStyle: {
    		color: Colors.textBlack,
    	},
   		indicatorStyle: {
			backgroundColor: Colors.grass,
		},
	},
})

TabNavigation.navigationOptions = props => {
	const {navigation} = props;
	return {
		headerTitle: 'HOME PAGE', //标题
	    headerTitleStyle: { //标题字体
	  		color: Colors.navigation,
  	},
	   	headerStyle: { //标题样式
	   		backgroundColor: Colors.grass,
	   	},
	   	headerLeft: (
	   		<TouchableOpacity
	   			onPress={() => navigation.navigate('DrawerOpen')}
	   			>
		   		<Image
			   	    source={require('../assets/content.png')}
			        style={styles.icon}
		    	/>
		    </TouchableOpacity>
	   	),
	   	headerRight: (
	   		<Text style={styles.headerRightText}
	   			onPress={() => navigation.navigate('Other')}
			>
	   			Go
	   		</Text>
	    ),
	}
};

const styles = StyleSheet.create({
	icon: {
		width: 24,
		height: 24,
		marginLeft: 20,
		marginRight: 8,
	},
	headerRightText:{
		color: Colors.textWhite,
		fontSize: 18,
		marginRight: 20,
	}
})

export default TabNavigation