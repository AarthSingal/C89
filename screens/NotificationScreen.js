import React  from "react";
import { View,Text , TouchableOpacity,ScrollView,FlatList,StyleSheet} from "react-native";
import { Card,Icon,ListItem} from 'react-native-elements';
import db from '../config'
import MyHeader from "../components/MyHeader";
import firebase from "firebase";
import SwipeableFlatList from '../components/SwipeableFlatList';

export default class NotificationScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userId : firebase.auth().currentUser.email,
            allNotifications : []
        }
        this.notificationRef= null  
    }

    getNotifications=async ()=>{
        this.notificationRef = await db.collection("allNotifications")
        .where("notification_status",'==','unread')
        .where("targated_user_id","==",this.state.userId)
        .onSnapshot(snapshot=>{
            var allNotifications = []
            snapshot.docs.map(doc=>{
                var notification = doc.data()
                notification["doc_id"] = doc.id
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications : allNotifications
            })
        })
    }

  componentDidMount(){
        this.getNotifications()
    }

    componentWillUnmount(){
        this.notificationRef()
    }

    keyExtractor = (item,index) => index.toString()

    renderItem=({item,index})=>{
      return(<ListItem
        key={index}
        leftElement={<Icon name="book" type="font-awesome" color='#696969'/>}
        title={item.book_name}
        titleStyle={{color:"black",fontWeight:'bold'}}
        subtitle={item.message}
        bottomDivider
        />)
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <MyHeader title="Notifications" navigation={this.props.navigation}/>
                </View>
                <View style={{flex:0.9}}>
                    {
                        this.state.allNotifications.length===0
                        ?(
                           <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                               <Text style={{fontSize:25}}>You Have No Notifications</Text>
                           </View> 
                        )
                        :(
                            <SwipeableFlatList allNotifications={this.state.allNotifications}/>
                        )
                    }
                </View>
            </View>
        )
    }
}
