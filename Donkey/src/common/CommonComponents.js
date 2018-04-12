import React, {
	Component
} from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
} from 'react-native';
// import moment from 'moment';
import {
	getDateDiff
} from '../common/apis';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

//单个评论
class SingleComment extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	render() {
		let {
			avatarUrl,
			nickname
		} = this.props.user;
		let {
			time,
			content,
			likedCount,
		} = this.props;

		return (
			<View style={styles.row}>
			    <Image style={styles.thumb} source={{uri: avatarUrl}} resizeMode={Image.resizeMode.cover}/>
			   	<View style={styles.textBox}>
			   	<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
			   		<View style={{flexDirection: 'column'}}>
				        <Text style={[styles.text, {color: '#696969'}]} numberOfLines={1}>
			        		{nickname || ''}	
				        </Text>
				        <Text style={[styles.text, {color: '#808080', fontSize: 9,}]} numberOfLines={1}>
				        	{!!time ? getDateDiff(time) : ''}
				        </Text>
			        </View>
			        <View style={{flexDirection: 'row', alignItems: 'center'}}>
			        	<Text style={{color: '#696969', fontSize: 9, marginRight: 2}}>{likedCount}</Text>
			        	<Image style={styles.liked} source={require('../assets/liked.png')} />
			        </View>
			    </View>
			      	<Text style={styles.textContent}>
		        		{content || ''}	
			        </Text>
			    </View>
		    </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listView: {
		backgroundColor: '#ffffff',
	},
	titleBox: {
		backgroundColor: '#efeff4',
		paddingLeft: 5,
		paddingRight: 5,
	},
	title: {
		lineHeight: 27,
		fontSize: 12,
		color: Colors.textBlack,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 10,
		backgroundColor: '#F6F6F6',
		borderColor: Colors.backgroundColor,
		borderBottomWidth: 1,
	},
	liked: {
		width: 18,
		height: 18,
	},
	thumb: {
		marginTop: 0,
		width: 30,
		height: 30,
		borderRadius: 30,
	},
	textBox: {
		flex: 1,
		paddingTop: 0,
		paddingLeft: 0,
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	text: {
		fontSize: 10,
		padding: 2,
		start: 6,
		color: Colors.textBlack,
	},
	textContent: {
		fontSize: 12,
		start: 6,
		color: Colors.textBlack,
	},
	noList: {
		height: 100,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.rowColor,
	},
	noListText: {
		color: '#808080',
		fontSize: 12,
	}
});

export {
	SingleComment
};