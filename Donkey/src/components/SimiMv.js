import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight,
	ListView,
	BackHandler,
} from 'react-native';

import Video from 'react-native-video';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {
	getSimiMv
} from '../services/getResources';

class SectionTitle extends React.Component {
	render() {
		return (
			<View style={styles.titleBox}>
				<Text style={styles.title}>相关推荐</Text>
			</View>
		);
	}
}

class SimiMv extends React.Component {
	constructor(props) {
		super(props);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		let {
			mvId
		} = this.props;
		this.state = {
			...this.props,
			...{
				ds: ds,
				// data: [{}],
				data: [],
			},
			mvId: mvId,
		};
		this.SimiMv = this.SimiMv.bind(this);
		this._renderListView = this._renderListView.bind(this);
		this._doClick = this._doClick.bind(this);
		this._renderList = this._renderList.bind(this);
	}

	componentWillMount() {
		this.SimiMv();
	}

	componentDidMount() {
		// this.listener = BackHandler.addEventListener('hardwareBackPress', () => {
		// 	const {
		// 		goBack
		// 	} = this.props.navigation;
		// 	console.log('goBack', this.props.navigation);
		// 	goBack('TabNavigation');
		// 	return true; //返回true的时候，不会向下传递事件,为false的时候，则是默认的事件，返回到上一页面
		// });
	}

	componentWillUnmount() {
		// this.listener && this.listener.remove();
	}

	componentWillReceiveProps(nextProps) {
		let oldMvId = this.props.mvId;
		let newMvId = nextProps.mvId;
		if (oldMvId == newMvId) {
			return;
		}
		this.setState({
			mvId: newMvId,
		});
		this.SimiMv();
	}

	async SimiMv() {
		if (!this.state.mvId) {
			alert('Error in getting mvId');
			return;
		}
		var res = await getSimiMv(this.state.mvId);
		if (res.mvs.length > 0) {
			res.mvs.slice(0, 5);
			this.setState({
				data: res.mvs,
			});
		}
	}

	_doClick(id, name) {
		//跳转页面前 暂停当前视频
		this.props.toNextVideo(id, name);
		// const {
		// 	navigate,
		// 	replace,
		// 	pop,
		// } = this.props.navigation;
		// navigate('MvPlayer', {
		// 	mvId: id,
		// 	mvName: name
		// });
		// setTimeout((function() {
		// 	pop(1)
		// }), 0);
	}

	_renderListView(rowData) {
		if (!rowData.id) {
			return null;
		}
		let {
			id,
			name
		} = rowData;
		return (
			<TouchableOpacity activeOpacity={0.9} onPress={()=>{this._doClick(id, name)}}>
	          	<View style={styles.row}>
	            	<Image style={styles.thumb} source={{uri: rowData.cover}} />
	            	<View style={styles.textBox}>
	            		<Text style={styles.text} numberOfLines={1}>
		            		{rowData.name}	
		            	</Text>
		            	<Text style={[styles.text, {color: '#808080', fontSize: 11,}]} numberOfLines={1}>
		            		{rowData.artistName}	
		            	</Text>
	            	</View>
	          	</View>
	        </TouchableOpacity>
		);
	}

	// render() {
	// 	return (
	// 		<View style={styles.container}>
	// 			<SectionTitle />
	// 			<ListView style={styles.listView}
	// 				dataSource={this.state.ds.cloneWithRows(this.state.data)}
	// 				renderRow={this._renderListView}
	// 		        contentContainerStyle={styles.listView}
	// 		        initialListSize={5}
	// 				>
	// 			</ListView>
	// 		</View>
	// 	);
	// }

	_renderList(list) {
		let dom = [];
		for (let i = 0, len = list.length; i < len; i++) {
			let item = list[i];
			let {
				id,
				name
			} = item;
			dom.push(
				<TouchableOpacity key={i} activeOpacity={0.9} onPress={()=>{this._doClick(id, name)}}>
		          	<View style={styles.row}>
		            	<Image style={styles.thumb} source={{uri: item.cover}} />
		            	<View style={styles.textBox}>
		            		<Text style={styles.text} numberOfLines={1}>
			            		{item.name}	
			            	</Text>
			            	<Text style={[styles.text, {color: '#808080', fontSize: 11,}]} numberOfLines={1}>
			            		{item.artistName}	
			            	</Text>
		            	</View>
		          	</View>
		        </TouchableOpacity>
			);
		}
		return dom;
	}

	render() {
		let list = this._renderList(this.state.data);
		return (
			<View style={styles.container}>
				<SectionTitle />
				{list}
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
		backgroundColor: Colors.rowColor,
		borderColor: Colors.backgroundColor,
		borderBottomWidth: 1,
	},
	thumb: {
		width: 100,
		height: 56,
	},
	textBox: {
		flex: 1,
		flexDirection: 'column',
		// alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		padding: 2,
		start: 6,
		color: Colors.textBlack,
	},
});

export default SimiMv;