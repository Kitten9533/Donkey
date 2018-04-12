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

class MvPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...this.props,
			...{
				cover: null,
				mvUrl: null,
				loadend: false,
				videoWidth: Layout.window.width,
				videoHeight: 200,
				isPlaying: false,
				playingRate: 1.0,
				firstLoad: true,
				firstPage: true,
				name: '',
				artistName: '',
				artistId: '',
				briefDesc: '',
				desc: '',
				data: {},
				isLoading: false,
				hotComments: [],
				comments: [],
				offset: 0,
				limit: 20,
				canScroll: false,
			},
		};
		this.getMvDetail = this.getMvDetail.bind(this);
		this.getMvBox = this.getMvBox.bind(this);
		this._setPlaying = this._setPlaying.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.getShade = this.getShade.bind(this);
		this.videoPause = this.videoPause.bind(this);
		this._renderItem = this._renderItem.bind(this);
		this._renderHotComments = this._renderHotComments.bind(this);
		this._renderEmptyView = this._renderEmptyView.bind(this);
	}

	static navigationOptions = ({
		navigation
	}) => ({
		title: navigation.state.params.mvName,
		// header: null,
		// headerStyle: {
		// 	backgroundColor: 'rgba(0, 0, 0, 0)',
		// 	height: 50,
		// },
		// headerTitleStyle: { //标题字体
		// 	color: Colors.textBlack,
		// },
	})

	_onLayout(evnet) {
		let {
			width,
			height
		} = event.nativeEvent.layout;
		this.setState({
			videoWidth: width,
			// videoHeight: height,
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
		let mvUrl = null,
			cover = res.data.cover;
		//mv视频地址
		let brs = res.data.brs;
		let briefDesc = res.data.briefDesc;
		let desc = res.data.desc;
		let name = res.data.name;
		let artistName = res.data.artistName;
		let artistId = res.data.artistId;
		let data = res.data;
		mvUrl = brs['720'] || brs['480'] || brs['240'] || brs['1080'] || '';
		if (!mvUrl) {
			alert('Error in getting mv urls');
		}
		this.setState({
			loadend: true,
			mvUrl: mvUrl,
			cover: cover,
			briefDesc: briefDesc,
			desc: desc,
			name: name, //mv名
			artistName: artistName, //作者
			artistId: artistId, //作者id
			data: data,
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
		let oldComments = this.state.comments;
		if (this.state.offset == 0) {
			this.setState({
				firstPage: false,
				hotComments: hotComments,
				comments: comments,
				total: total,
				isLoading: false,
				canScroll: true,
			});
		} else {
			this.setState({
				firstPage: false,
				comments: oldComments.concat(comments),
				isLoading: false,
				canScroll: true,
			});
		}

	}

	componentDidMount() {
		const {
			params
		} = this.props.navigation.state;
		//在static中使用this方法  
		this.props.navigation.setParams({
			mvName: params.mvName,
			mvId: params.mvId,
		});
		this.mvComment();
	}

	componentWillMount() {
		this.getMvDetail();
	}

	_setPlaying() {
		let {
			firstLoad,
			isPlaying,
			playingRate
		} = this.state;
		if (firstLoad) { //在播放中判断是否暂停
			this.setState({
				firstLoad: false,
				isPlaying: true,
			});
		} else {
			this.setState({
				firstLoad: false,
				isPlaying: !isPlaying
			})
		}
	}

	onEnd() {
		let isPlaying = this.state.isPlaying;
		this.setState({
			isPlaying: false,
		})
	}

	videoPause() {
		//子页面点击事件触发，使页面跳转时使视频暂停
		this.setState({
			isPlaying: false,
		});
	}

	getMvBox() {
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		if (!this.state.mvUrl) {
			return null;
		}
		return (
			<Video source={{uri: this.state.mvUrl}}   // Can be a URL or a local file. 
		       	ref={(ref) => {
		        	this.player = ref
		       	}}                                      // Store reference 
		       	rate={this.state.playingRate}                              // 0 is paused, 1 is normal. 
		       	volume={1.0}                            // 0 is muted, 1 is normal. 
		       	muted={false}                           // Mutes the audio entirely. 
		       	paused={!this.state.isPlaying}                          // Pauses playback entirely. 
		       	resizeMode="cover"                      // Fill the whole screen at aspect ratio.* 
		       	repeat={false}                           // Repeat forever. 
		       	playInBackground={false}                // Audio continues to play when app entering background. 
		       	playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown. 
		       	ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual. 
		       	progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms) 
				onLoadStart={this.loadStart}            // Callback when video starts to load 
				onLoad={this.setDuration}               // Callback when video loads 
				onProgress={this.setTime}               // Callback every ~250ms with currentTime 
				onEnd={this.onEnd}                      // Callback when playback finishes 
				onError={this.videoError}               // Callback when video cannot be loaded 
				onBuffer={this.onBuffer}                // Callback when remote video is buffering 
				onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
		       	// style={styles.video} 
		       	style={{width: this.state.videoWidth, height: this.state.videoHeight}}
		    />
		);

	}

	getShade() {
		let {
			firstLoad,
			isPlaying
		} = this.state;
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		let coverImg = null;
		if (firstLoad) {
			coverImg = (
				<Image 
					source = {{uri: this.state.cover}} 
					style={[defaultSize]}
				/>
			);
			return (
				<View style={[styles.shadeBox, defaultSize]}>
					<View style={[styles.shade, defaultSize]}>
						<Image
						style = {styles.videoIcon}
						source = {require('../assets/play.png')	} />
					</View>
					<View style={[styles.shade2, defaultSize]}>
						{coverImg}
					</View>
				</View>
			);
		} else if (!firstLoad && !isPlaying) {
			return (
				<View style={[styles.shadeBox, defaultSize]}>
					<View style={[styles.shade, defaultSize]}>
						<Image
						style = {styles.videoIcon}
						source = {require('../assets/play.png')	} />
					</View>
				</View>
			);
		} else {
			return null;
		}
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

	_renderHeader = () => {
		const {
			params
		} = this.props.navigation.state;
		let myMvBox = this.getMvBox();
		// let myShade = null;
		let myShade = this.getShade();
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		let hotComments = this._renderHotComments();
		let total = this.state.total;
		let title = (
			<SectionTitle content={`最新评论(${total})`}/>
		);
		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<TouchableHighlight style={[styles.videoBox, defaultSize]} onPress={() => {this._setPlaying()}} underlayColor='#fff'>
					<View>
						{myMvBox}
					</View>
				</TouchableHighlight>
				<TouchableOpacity style={[styles.videoModal ,defaultSize]} onPress={() => {this._setPlaying()}}>
					{myShade}
				</TouchableOpacity>
				<MvInfo {...this.state}/>
				<SimiMv mvId={this.props.navigation.state.params.mvId} navigation={this.props.navigation} videoPause={this.videoPause}/>
				{hotComments}
				{title}
			</View>
		);
	}

	_renderEmptyView = () => {
		return (
			<View style={styles.noList}>
				<Text style={styles.noListText}>
					暂无评论,欢迎抢沙发
				</Text>
			</View>
		);
	}

	onEndReached = () => {
		if (!this.state.canScroll) {
			return;
		}
		let offset = this.state.offset;
		offset++;
		this.setState({
			canScroll: false,
			offset: offset
		});
		this.mvComment();
	}

	_renderItem = ({
		item,
		index
	}) => {
		if (Object.keys(item).length == 0) {
			return null;
		}
		let {
			id,
			name
		} = item;
		return (
			<View style={styles.row}>
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

	_flatList;
	_keyExtractor = (item, index) => index.toString();

	render() {
		const {
			params
		} = this.props.navigation.state;
		let myMvBox = this.getMvBox();
		// let myShade = null;
		let myShade = this.getShade();
		let defaultSize = {
			width: this.state.videoWidth,
			height: this.state.videoHeight
		};
		// return (
		// 	<ScrollView style={styles.container}>
		// 		<StatusBar hidden={true} />
		// 		<TouchableHighlight style={[styles.videoBox, defaultSize]} onPress={() => {this._setPlaying()}} underlayColor='#fff'>
		// 			<View>
		// 				{myMvBox}
		// 			</View>
		// 		</TouchableHighlight>
		// 		<TouchableOpacity style={[styles.videoModal ,defaultSize]} onPress={() => {this._setPlaying()}}>
		// 			{myShade}
		// 		</TouchableOpacity>
		// 		<MvInfo {...this.state}/>
		// 		<SimiMv mvId={this.props.navigation.state.params.mvId} navigation={this.props.navigation} videoPause={this.videoPause}/>
		// 		<Comments mvId={this.props.navigation.state.params.mvId} navigation={this.props.navigation} videoPause={this.videoPause}/>
		// 	</ScrollView>
		// );
		return (
			<View style={styles.container}>
				<FlatList
					ref={(flatlist)=>{this.flatlist = flatlist}}
				    data={this.state.comments}
				    ListHeaderComponent={this._renderHeader}
				    renderItem={this._renderItem}
				    keyExtractor={this._keyExtractor}
				    onEndReachedThreshold={0.5}
				    onEndReached={this.onEndReached}
				    ListEmptyComponent={this._renderEmptyView}
				/>
			</View>
		);
	}
}

class TextContent extends React.Component {
	render() {
		return (
			<Text  
				style={styles.contentName}
				numberOfLines={this.props.linesNum}>
				{this.props.contentVal}
			</Text>
		);
	}
}

class MvInfo extends React.Component {
	render() {
		return (
			<View style={[styles.mvDetail]}>
				<TextContent linesNum={1} contentVal={this.props.name} />
				<Text style={[styles.mvDetailText ,styles.textLeft]} >
					{`发布：${this.props.data.publishTime}     |     播放：${this.props.data.playCount}`}
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