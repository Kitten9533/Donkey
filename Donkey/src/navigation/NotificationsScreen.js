import React, {
    Component
} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
} from 'react-native';

import Colors from '../constants/Colors';
// import NavigationService from '../services/NavigationService';
import CommonNavigation from '../navigation/CommonNavigation';
import LeftUserInfo from '../pages/LeftUserInfo';
// import Sub from '../pages/Sub';
// import Other from '../pages/Other';
import {
    DrawerNavigator
} from 'react-navigation'

// class FirstPage extends React.Component{
//     render(){
//         return (
//             <CommonNavigation 
//                ref={navigatorRef => {
//                   NavigationService.setTopLevelNavigator(navigatorRef);
//                 }}
//             />
//             )
//     }
// }

class NotificationsScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
        drawerIcon: ({
            tintColor
        }) => (
            <Image
        source={require('../assets/notif-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
        ),
        // itemsContainerStyle: {
        //     backgroundColor: 'red',
        // },
        // itemStyle: {
        //     backgroundColor: 'red',
        // },
    };

    render() {
        const {
            navigate
        } = this.props.navigation;
        return (
            <Button
        onPress={() => navigate('Other')}
        title="Go to Sub"
        color={Colors.grass}
      />
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});

const MyApp = DrawerNavigator({
    Home: {
        screen: CommonNavigation,
        navigationOptions: {
            title: 'xixi'
        },
    },
    LeftUserInfo: {
        screen: LeftUserInfo,
    },
    // Other: {
    //   screen: Other,
    // },
    // Sub: {
    //   screen: Sub,
    // },
}, {
    drawerBackgroundColor: Colors.navigation,
});

export default MyApp