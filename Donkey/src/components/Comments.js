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
	ScrollView,
} from 'react-native';
// import moment from 'moment';
import {
	getDateDiff
} from '../common/apis';
import Video from 'react-native-video';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {
	getMvComment
} from '../services/getResources';

class SectionTitle extends React.Component {
	render() {
		return (
			<View style={styles.titleBox}>
				<Text style={styles.title}>{this.props.content}</Text>
			</View>
		);
	}
}

class Comments extends React.Component {
	constructor(props) {
		super(props);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		const ds2 = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			...this.props,
			...{
				ds: ds,
				ds2: ds2,
				// hotComments: [{}],
				hotComments: [],
				comments: [{}],
				offset: 0,
				limit: 10,
				firstLoad: true,
				isLoading: false,
			},
		};
		this.mvComment = this.mvComment.bind(this);
		this._renderListView = this._renderListView.bind(this);
		this._doClick = this._doClick.bind(this);
		this._endReached = this._endReached.bind(this);
		this._renderFooter = this._renderFooter.bind(this);
		this._renderHotComments = this._renderHotComments.bind(this);
		this._renderCommnets = this._renderCommnets.bind(this);
		this._getHotComments = this._getHotComments.bind(this);
	}

	componentWillMount() {
		this.mvComment();
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

	async mvComment() {
		if (!this.props.mvId) {
			alert('Error in getting mvId');
			return;
		}
		this.setState({
			isLoading: true,
		});
		let {
			offset,
			limit
		} = this.state;
		let res = await getMvComment(this.props.mvId, offset, limit);
		let {
			hotComments,
			comments,
			total
		} = res;
		this.setState({
			firstLoad: false,
			hotComments: hotComments,
			comments: comments,
			total: total,
			isLoading: false,
		});
	}

	_doClick(id, name) {
		//跳转页面前 暂停当前视频
		this.props.videoPause();
		const {
			navigate,
			replace,
			pop,
		} = this.props.navigation;
		navigate('MvPlayer', {
			mvId: id,
			mvName: name
		});
		// setTimeout((function() {
		// 	pop(1) 
		// }), 0);
	}

	_endReached() {
		// if (this.state.firstLoad) {
		// 	return;
		// }
		// this.mvComment();
	}

	_renderListView(rowData) {
		//为空时 ，返回null
		if (Object.keys(rowData).length == 0) {
			return null;
		}
		let {
			id,
			name
		} = rowData;
		return (
			<View style={styles.row}>
		       	<Image style={styles.thumb} source={{uri: rowData.user.avatarUrl}} resizeMode={Image.resizeMode.cover}/>
		       	<View style={styles.textBox}>
			        <Text style={styles.text} numberOfLines={1}>
		        		{rowData.user.nickname || ''}	
			        </Text>
			        <Text style={[styles.text, {color: '#808080', fontSize: 9,}]} numberOfLines={1}>
			        	{!!rowData.time ? getDateDiff(rowData.time) : ''}
			        </Text>
			      	<Text style={styles.textContent}>
		        		{rowData.content || ''}	
			        </Text>
			    </View>
		    </View>
		);
	}

	// _renderHotComments() {
	// 	return (
	// 		<View>
	// 			<SectionTitle content={`精彩评论`}/>
	// 			<ListView style={styles.listView}
	// 				dataSource={this.state.ds.cloneWithRows(this.state.hotComments)}
	// 				renderRow={this._renderListView}
	// 		        contentContainerStyle={styles.listView}
	// 		        initialListSize={5}
	// 		        pageSize={5}
	// 				>
	// 			</ListView>
	// 		</View>
	// 	);
	// }

	_getHotComments(list) {
		var dom = [];
		for (let i = 0, len = list.length; i < len; i++) {
			let item = list[i];
			dom.push(
				<View key={i} style={styles.row}>
			       	<Image style={styles.thumb} source={{uri: item.user.avatarUrl}} resizeMode={Image.resizeMode.cover}/>
			       	<View style={styles.textBox}>
				        <Text style={styles.text} numberOfLines={1}>
			        		{item.user.nickname || ''}	
				        </Text>
				        <Text style={[styles.text, {color: '#808080', fontSize: 9,}]} numberOfLines={1}>
				        	{!!item.time ? getDateDiff(item.time) : ''}
				        </Text>
				      	<Text style={styles.textContent}>
			        		{item.content || ''}	
				        </Text>
				    </View>
			    </View>
			);
		}
		return dom;
	}

	_renderHotComments() {
		let list = this.state.hotComments;
		if (list.length > 0) {
			var dom = this._getHotComments(list);
			return (
				<View>
					<SectionTitle content={`精彩评论`}/>
					{dom}
				</View>
			);
		}
		return null;
	}

	_renderFooter() {
		let footer = null;
		if (this.state.isLoading) {
			footer = (
				<View style={[styles.card, ...styles.footer]}>
					<Image
					   	source={require('../assets/loading3.gif')}
					    style={styles.footerImg}
				    />
				</View>
			);
		}
		return footer;
	}

	_renderCommnets() {
		let total = this.state.total;
		let title = (
			<SectionTitle content={`最新评论${total}`}/>
		);
		if (total > 0) {
			total = `(${this.state.total})`;
			return (
				<View>
					{title}
					<ListView style={styles.listView}
						dataSource={this.state.ds2.cloneWithRows(this.state.comments)}
						renderRow={this._renderListView}
				        contentContainerStyle={styles.listView}
				        initialListSize={5}
				        onEndReached={() => this._endReached()}
		       			onEndReachedThreshold={50}
		       			renderFooter={() => this._renderFooter()}
		       			pageSize={5}
						>
					</ListView>
				</View>
			);
		}
		return (
			<View>
				{title}
				<View style={styles.noList}>
					<Text style={styles.noListText}>
						暂无评论,欢迎抢沙发
					</Text>
				</View>
			</View>
		);
	}

	render() {
		let hotComments = null;
		if (this.state.hotComments.length > 0) {
			hotComments = this._renderHotComments();
		}
		let comments = this._renderCommnets();
		// let comments = null;
		return (
			<View style={styles.container}>
				{hotComments}
				{comments}
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

export default Comments;