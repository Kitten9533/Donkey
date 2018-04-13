import React, {
	Component
} from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image,
	StatusBar,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight,
	ScrollView,
	FlatList,
	SectionList,
	ActivityIndicator,
	LayoutAnimation,
} from 'react-native';

import Video from 'react-native-video';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

import {
	getMvDetail,
	getMvComment,
} from '../services/getResources';
import {
	getDateDiff
} from '../common/apis';
import SectionTitle from '../common/SectionTitle';
import SimiMv from '../components/SimiMv';
import Comments from '../components/Comments';
import Player from '../components/Player';
import {
	SingleComment
} from '../common/CommonComponents';

class MvPlayer extends React.Component {

	_sectionList;

	constructor(props) {
		super(props);

		let {
			navigation
		} = this.props;
		let {
			mvId
		} = navigation.state.params;
		this.state = {
			dataSource: [{
				data: [1],
				key: 'video',
			}, {
				data: [2],
				key: 'mvdetail',
			}, {
				data: [3],
				key: 'simimv',
			}, {
				data: [],
				key: 'hotcomments',
			}, {
				data: [],
				key: 'comments',
			}],
			loadend: false, //是否获取完 mv信息
			isPlaying: false, //视频是否播放
			offset: 0,
			limit: 20,
			hotComments: [], //热评
			comments: [], //评论
			total: 0, //评论总数默认0,
			navigation: navigation,
			mvId: mvId,
			showLoading: true,
			gettingData: true,
		};
		this._renderPlayer = this._renderPlayer.bind(this);
		this.toNextVideo = this.toNextVideo.bind(this);
		this._renderItem = this._renderItem.bind(this);
		this.setPlayingState = this.setPlayingState.bind(this);
	}

	static navigationOptions = ({
		navigation
	}) => ({
		title: navigation.state.params.mvName,
	})

	componentWillMount() {
		LayoutAnimation.spring();
		this.getMvDetail();
		this.mvComment();
	}

	_onLayout(evnet) {
		let {
			width,
			height
		} = event.nativeEvent.layout;
		this.setState({
			videoWidth: width,
		})
	}

	async getMvDetail() {
		const {
			params
		} = this.props.navigation.state;
		if (!params.mvId) {
			alert('Error in getting mvId');
			return;
		}
		let res = await getMvDetail(params.mvId);
		let mvUrl = null;
		let data = res.data;
		const {
			brs,
		} = res.data;
		mvUrl = brs['480'] || brs['720'] || brs['240'] || brs['1080'] || '';
		if (!mvUrl) {
			alert('Error in getting mv urls');
		}
		this.setState({
			loadend: true,
			mvUrl: mvUrl,
			showLoading: false,
			...data,
			gettingData: false,
		});
	}

	async mvComment() {
		const {
			params
		} = this.props.navigation.state;
		if (!params.mvId) {
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
		let res = await getMvComment(params.mvId, offset * limit, limit);
		let {
			hotComments,
			comments,
			total
		} = res;
		total = total || 0;
		let oldComments = this.state.dataSource[4].data;
		let {
			dataSource
		} = this.state;
		if (this.state.offset == 0) {
			let obj = {
				data: hotComments,
				key: 'hotcomments'
			};
			let obj2 = {
				data: comments,
				key: 'comments',
			}
			dataSource[3] = obj;
			dataSource[4] = obj2;
			this.setState({
				dataSource: dataSource,
				total: total,
			});
		} else {
			let obj = {
				data: oldComments.concat(comments),
				key: 'comments',
			}
			dataSource[4] = obj;
			this.setState({
				dataSource: dataSource
			});
		}
	}

	_renderPlayer() {
		let {
			mvUrl,
			cover,
			isPlaying,
			showLoading,
		} = this.state;
		if (this.state.mvUrl) {
			// return <Player mvUrl={mvUrl} isPlaying={isPlaying} cover={cover} showLoading={showLoading} setPlayingState={this.setPlayingState}/>;
			return <Player mvUrl={mvUrl} cover={cover} showLoading={showLoading}/>;
		}
		return null;
	}

	setPlayingState(isPlaying) {
		this.setState({
			isPlaying: isPlaying
		});
	}

	_renderMvDetail() {
		if (this.state.loadend) {
			return <MvInfo {...this.state}/>;
		}
		return null;
	}

	_extraUniqueKey(item, index) {
		return `index${index}${item}`;
	}

	_renderItem = ({
		item,
		index,
		section,
	}) => {
		switch (section.key) {
			case 'video':
				return this._renderPlayer();
				break;
			case 'mvdetail':
				return this._renderMvDetail();
				break;
			case 'simimv':
				return <SimiMv mvId={this.state.mvId} navigation={this.state.navigation} toNextVideo={this.toNextVideo}/>;
				break;
			case 'hotcomments':
				return <SingleComment {...item}/>;
				break;
			case 'comments':
				return <SingleComment {...item}/>;
				break;
			default:
				return null;
				break;
		}
	};

	//每个section的header
	_renderSectionHeader = ({
		section
	}) => {
		let {
			dataSource,
			total,
		} = this.state;
		switch (section.key) {
			case 'hotcomments':
				//dataSource[3]是 热评
				if (dataSource[3].data.length == 0) {
					return null;
				}
				return <SectionTitle content={`精彩评论`}/>;
				break;
			case 'comments':
				//dataSource[4]是 最新评论
				return <SectionTitle content={`最新评论(${total})`}/>;
				break;
			default:
				return null;
				break;
		}
	}

	//头部组件
	_listHeaderComponent = () => {
		if (!this.state.gettingData) {
			return null;
		}
		return (
			<View style={styles.headerView}>
				<Image 
					style={styles.sectionHeaderIcon} 
					source={require('../assets/loading2.gif')}
				/>
	        </View>
		);
	}

	async _onEndReached() {
		let {
			offset
		} = this.state;
		await this.setState({
			offset: offset + 1
		})
		await this.mvComment(offset);
		return;
		let {
			dataSource
		} = this.state;
		let data = dataSource[4].data.concat(dataSource[4].data);
		dataSource[4].data = data;
		this.setState({
			dataSource: dataSource
		})
	}

	_getRef = (ref) => {
		this._sectionList = ref;
	}

	async toNextVideo(newId, newName) {
		this.setState({
			gettingData: true,
		});
		LayoutAnimation.spring();
		await this.setParams(newId, newName);
		this.getMvDetail();
		this.mvComment();
		// this._sectionList.getNode().recordInteraction();
	}

	setParams(newId, newName) {
		this._sectionList.scrollToLocation({
			sectionIndex: 0,
			itemIndex: 0,
			viewPosition: 0
		});
		this.props.navigation.setParams({
			mvName: newName,
			mvId: newId,
		});
		//子页面点击事件触发，使页面跳转时使视频暂停
		this.setState({
			// isPlaying: false,
			offset: 0,
			mvName: newName,
			mvId: newId,
			showLoading: true,
		});
	}

	render() {
		const {
			params
		} = this.props.navigation.state;
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};

		return (
			<View>
				<SectionList
					ref={this._getRef}
            	    contentInset={{top:0,left:0,bottom:49,right:0}}// 设置他的滑动范围
                    renderItem={this._renderItem}
                    // ListFooterComponent={this._listFooterComponent}
                    // ListHeaderComponent={this._listHeaderComponent}
		// renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._extraUniqueKey}// 每个item的key
                    renderSectionHeader={this._renderSectionHeader}
                    // contentContainerStyle={styles.list}
                    // horizontal={true}
                    // pageSize={4}  // 配置pageSize确认网格数量
                    onEndReached={() => {this._onEndReached()}}
                    onEndReachedThreshold={0.3}
                    ListHeaderComponent={this._listHeaderComponent}
                    sections={ // 不同section渲染相同类型的子组件
                        this.state.dataSource
                    }
                />
			</View>
		);
	}
}

class TextContent extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.props;
	}
	componentWillReceiveProps(nextProps) {
		this.setState(nextProps);
	}
	render() {
		let {
			linesNum,
			contentVal,
		} = this.state;
		return (
			<Text  
				style={styles.contentName}
				numberOfLines={linesNum}>
				{contentVal}
			</Text>
		);
	}
}

class MvInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.props;
	}
	componentWillReceiveProps(nextProps) {
		this.setState(nextProps);
	}
	render() {
		let {
			name,
			publishTime,
			playCount
		} = this.props;
		return (
			<View style={[styles.mvDetail]}>
				<TextContent linesNum={1} contentVal={name} />
				<Text style={[styles.mvDetailText ,styles.textLeft]} >
					{`发布：${publishTime}     |     播放：${playCount}`}
				</Text>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},
	videoBox: {
		position: 'relative',
		backgroundColor: '#000000',
	},
	headerView: {
		flex: 1,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sectionHeaderIcon: {
		width: 30,
		height: 30,
	},
	videoModal: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	shadeBox: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 100,
		backgroundColor: 'rgba(0,0,0,0.45)',
	},
	shade: { //暂停播放图标
		position: 'absolute',
		top: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 102,
		backgroundColor: 'rgba(0,0,0,0.45)',
	},
	shade2: { //背景图片
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 101,
	},
	videoIcon: {
		width: 36,
		height: 36,
	},
	contentName: {
		lineHeight: 18,
		fontSize: 12,
		color: Colors.textBlack,
	},
	mvDetail: {
		paddingTop: 12,
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 12,
		backgroundColor: Colors.rowColor,
	},
	mvDetailText: {
		marginTop: 3,
		lineHeight: 15,
		fontSize: 12,
		color: '#808080',
	},
	textLeft: {
		marginRight: 50,
	},
	textRight: {
		marginLeft: 50,
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

export default MvPlayer;