import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer, NavigatorScreenParams, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type CampusEvent = { id: string; title: string; date: string; venue: string; description: string };
const events: CampusEvent[] = [
 { id:'e1', title:'Tech Talk: Intro to AI', date:'Nov 18, 2026', venue:'ICT Auditorium', description:'A short talk on how AI tools work and how students can start building with them.' },
 { id:'e2', title:'Hackathon Kickoff', date:'Nov 21, 2026', venue:'Innovation Lab', description:'Meet your teammates and receive the challenge brief.' },
 { id:'e3', title:'Career Fair', date:'Nov 25, 2026', venue:'Gymnasium', description:'Talk to partner companies about internships and jobs.' },
 { id:'e4', title:'Mobile Dev Workshop', date:'Nov 28, 2026', venue:'Room 301', description:'Hands-on session: build and run a React Native app.' },
];
type TabParamList = { Events: undefined; Saved: undefined; Profile: undefined };
type RootStackParamList = { Login: undefined; Main: NavigatorScreenParams<TabParamList>; EventDetails: { eventId: string } };
type User = { name: string };
const NAVY = '#1A1751';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
type LoginProps = NativeStackScreenProps<RootStackParamList,'Login'>;
type EventsProps = CompositeScreenProps<BottomTabScreenProps<TabParamList,'Events'>,NativeStackScreenProps<RootStackParamList>>;
type SavedProps = CompositeScreenProps<BottomTabScreenProps<TabParamList,'Saved'>,NativeStackScreenProps<RootStackParamList>>;
type ProfileProps = BottomTabScreenProps<TabParamList,'Profile'>;
type DetailsProps = NativeStackScreenProps<RootStackParamList,'EventDetails'>;

function EventList({data,onOpen,emptyMessage}:{data:CampusEvent[];onOpen:(id:string)=>void;emptyMessage?:string}) {
 return <FlatList data={data} keyExtractor={item=>item.id} contentContainerStyle={data.length?styles.listContent:styles.emptyList}
  ListEmptyComponent={<Text style={styles.emptyText}>{emptyMessage}</Text>}
  renderItem={({item})=><Pressable style={styles.eventCard} onPress={()=>onOpen(item.id)}>
   <View style={styles.eventAccent}/><View style={{flex:1}}><Text style={styles.eventDate}>{item.date}</Text><Text style={styles.eventTitle}>{item.title}</Text>
   <View style={styles.venueRow}><Ionicons name="location-outline" size={15} color="#77758F"/><Text style={styles.eventVenue}>{item.venue}</Text></View></View>
   <Ionicons name="chevron-forward" size={21} color="#77758F"/></Pressable>}/>
}
function LoginScreen({onLogin}:{onLogin:(name:string)=>void}&LoginProps) {
 const [name,setName]=useState(''); const [error,setError]=useState('');
 const submit=()=>{const value=name.trim(); if(!value){setError('Please enter your name.');return;} setError('');onLogin(value);};
 return <SafeAreaView style={styles.loginContainer}><View style={styles.loginContent}>
  <View style={styles.logoCircle}><Ionicons name="school" size={38} color="#FFFFFF"/></View>
  <Text style={styles.brandTitle}>Campus Connect</Text><Text style={styles.loginSubtitle}>Your campus. Your events. Stay connected.</Text>
  <View style={styles.loginCard}><Text style={styles.welcomeTitle}>Welcome!</Text><Text style={styles.inputLabel}>Enter your name to continue</Text>
   <TextInput style={styles.nameInput} placeholder="Your name" placeholderTextColor="#9997AA" value={name} onChangeText={v=>{setName(v);if(error)setError('');}} autoCapitalize="words" returnKeyType="done" onSubmitEditing={submit}/>
   {!!error&&<Text style={styles.errorText}>{error}</Text>}
   <Pressable style={styles.primaryButton} onPress={submit}><Text style={styles.primaryButtonText}>Log In</Text><Ionicons name="arrow-forward" size={18} color="#FFFFFF"/></Pressable>
  </View><Text style={styles.footerText}>IT 313 • Mobile Programming</Text></View></SafeAreaView>;
}
function EventsScreen({navigation}:EventsProps) {
 const [lastRefreshed,setLastRefreshed]=useState('');
 useFocusEffect(useCallback(()=>{setLastRefreshed(new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}));},[]));
 return <SafeAreaView style={styles.screen}><View style={styles.screenIntro}><Text style={styles.pageEyebrow}>CAMPUS CONNECT</Text><Text style={styles.pageTitle}>Upcoming Events</Text><Text style={styles.pageSubtitle}>Discover what's happening around campus.</Text></View>
  <View style={styles.refreshRow}><Text style={styles.sectionLabel}>ALL EVENTS</Text><Text style={styles.refreshText}>Last refreshed: {lastRefreshed||'—'}</Text></View>
  <EventList data={events} onOpen={id=>navigation.navigate('EventDetails',{eventId:id})}/></SafeAreaView>;
}
function SavedScreen({navigation,savedIds}:SavedProps&{savedIds:string[]}) {
 const savedEvents=useMemo(()=>events.filter(e=>savedIds.includes(e.id)),[savedIds]);
 return <SafeAreaView style={styles.screen}><View style={styles.screenIntro}><Text style={styles.pageEyebrow}>YOUR COLLECTION</Text><Text style={styles.pageTitle}>Saved Events</Text><Text style={styles.pageSubtitle}>Events you don't want to miss.</Text></View>
  <EventList data={savedEvents} onOpen={id=>navigation.navigate('EventDetails',{eventId:id})} emptyMessage="No saved events yet."/></SafeAreaView>;
}
function ProfileScreen({user,onLogout}:ProfileProps&{user:User;onLogout:()=>void}) {
 const initials=user.name.trim().split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
 return <SafeAreaView style={styles.screen}><View style={styles.profileHeader}><Text style={styles.pageEyebrow}>CAMPUS CONNECT</Text><Text style={styles.pageTitle}>My Profile</Text><Text style={styles.pageSubtitle}>Your account information.</Text></View>
  <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View><Text style={styles.profileName}>{user.name}</Text><Text style={styles.profileCaption}>Campus Connect Student</Text><View style={styles.profileDivider}/>
   <View style={styles.profileInfoRow}><Ionicons name="person-outline" size={19} color="#77758F"/><Text style={styles.profileInfoText}>{user.name}</Text></View>
   <View style={styles.profileInfoRow}><Ionicons name="calendar-outline" size={19} color="#77758F"/><Text style={styles.profileInfoText}>Campus Events Member</Text></View></View>
  <Pressable style={styles.logoutButton} onPress={onLogout}><Ionicons name="log-out-outline" size={19} color="#D64545"/><Text style={styles.logoutText}>Log Out</Text></Pressable></SafeAreaView>;
}
function MainTabs({user,savedIds,toggleSaved,onLogout}:{user:User;savedIds:string[];toggleSaved:(id:string)=>void;onLogout:()=>void}) {
 return <Tab.Navigator screenOptions={({route})=>({headerStyle:{backgroundColor:NAVY},headerTintColor:'#FFFFFF',headerTitleStyle:{fontWeight:'700'},tabBarActiveTintColor:NAVY,tabBarInactiveTintColor:'#9997AA',tabBarStyle:styles.tabBar,tabBarLabelStyle:styles.tabLabel,
  tabBarIcon:({color,size})=>{const icons={Events:'calendar-outline',Saved:'bookmark-outline',Profile:'person-circle-outline'} as const;return <Ionicons name={icons[route.name]} size={size} color={color}/>;}})}>
  <Tab.Screen name="Events" options={{title:'Events'}}>{props=><EventsScreen {...props}/>}</Tab.Screen>
  <Tab.Screen name="Saved" options={{title:'Saved',tabBarBadge:savedIds.length? savedIds.length:undefined,tabBarBadgeStyle:{backgroundColor:'#E8B84A',color:NAVY}}}>{props=><SavedScreen {...props} savedIds={savedIds}/>}</Tab.Screen>
  <Tab.Screen name="Profile" options={{title:'Profile'}}>{props=><ProfileScreen {...props} user={user} onLogout={onLogout}/>}</Tab.Screen>
 </Tab.Navigator>;
}
function EventDetailsScreen({route,navigation,savedIds,toggleSaved}:DetailsProps&{savedIds:string[];toggleSaved:(id:string)=>void}) {
 const event=events.find(e=>e.id===route.params.eventId); const isSaved=savedIds.includes(route.params.eventId);
 useLayoutEffect(()=>{navigation.setOptions({title:'Event Details',headerRight:()=>event?<Pressable onPress={()=>toggleSaved(event.id)} style={styles.headerSaveButton}><Ionicons name={isSaved?'bookmark':'bookmark-outline'} size={19} color="#FFFFFF"/><Text style={styles.headerSaveText}>{isSaved?'Unsave':'Save'}</Text></Pressable>:null});},[navigation,event,isSaved,toggleSaved]);
 if(!event)return <SafeAreaView style={styles.screen}><View style={styles.notFoundBox}><Ionicons name="alert-circle-outline" size={38} color="#77758F"/><Text style={styles.emptyText}>Event not found.</Text></View></SafeAreaView>;
 return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.detailsContent}><View style={styles.detailsIcon}><Ionicons name="calendar" size={34} color="#FFFFFF"/></View>
  <Text style={styles.detailsDate}>{event.date}</Text><Text style={styles.detailsTitle}>{event.title}</Text><View style={styles.detailsVenueRow}><Ionicons name="location" size={18} color={NAVY}/><Text style={styles.detailsVenue}>{event.venue}</Text></View>
  <View style={styles.descriptionCard}><Text style={styles.sectionLabel}>ABOUT THIS EVENT</Text><Text style={styles.descriptionText}>{event.description}</Text></View>
  <Pressable style={[styles.primaryButton,styles.saveBodyButton]} onPress={()=>toggleSaved(event.id)}><Ionicons name={isSaved?'bookmark':'bookmark-outline'} size={19} color="#FFFFFF"/><Text style={styles.primaryButtonText}>{isSaved?'Remove from Saved':'Save Event'}</Text></Pressable>
 </ScrollView></SafeAreaView>;
}
export default function App() {
 const [user,setUser]=useState<User|null>(null); const [savedIds,setSavedIds]=useState<string[]>([]);
 const toggleSaved=useCallback((id:string)=>setSavedIds(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]),[]);
 const logout=useCallback(()=>{setUser(null);setSavedIds([]);},[]);
 return <NavigationContainer><Stack.Navigator screenOptions={{headerStyle:{backgroundColor:NAVY},headerTintColor:'#FFFFFF',headerTitleStyle:{fontWeight:'700'},contentStyle:{backgroundColor:'#F6F6FB'}}}>
  {!user?<Stack.Screen name="Login" options={{headerShown:false}}>{props=><LoginScreen {...props} onLogin={name=>setUser({name})}/>}</Stack.Screen>:<>
   <Stack.Screen name="Main" options={{headerShown:false}}>{props=><MainTabs {...props} user={user} savedIds={savedIds} toggleSaved={toggleSaved} onLogout={logout}/>}</Stack.Screen>
   <Stack.Screen name="EventDetails" options={{title:'Event Details'}}>{props=><EventDetailsScreen {...props} savedIds={savedIds} toggleSaved={toggleSaved}/>}</Stack.Screen>
  </>}
 </Stack.Navigator></NavigationContainer>;
}
const styles=StyleSheet.create({
 loginContainer:{flex:1,backgroundColor:NAVY,justifyContent:'center'},loginContent:{paddingHorizontal:25,alignItems:'center'},logoCircle:{width:76,height:76,borderRadius:38,backgroundColor:'#393477',alignItems:'center',justifyContent:'center',marginBottom:15},brandTitle:{color:'#FFF',fontSize:29,fontWeight:'800'},loginSubtitle:{color:'#D7D5F0',fontSize:13,marginTop:7,marginBottom:32,textAlign:'center'},loginCard:{width:'100%',backgroundColor:'#FFF',borderRadius:22,padding:23,elevation:5},welcomeTitle:{color:NAVY,fontSize:23,fontWeight:'800',marginBottom:7},inputLabel:{color:'#77758F',fontSize:13,marginBottom:10},nameInput:{height:51,borderWidth:1,borderColor:'#E1E0EA',borderRadius:11,paddingHorizontal:14,color:NAVY,fontSize:15,backgroundColor:'#FBFBFE'},errorText:{color:'#D64545',fontSize:12,marginTop:8},primaryButton:{backgroundColor:NAVY,borderRadius:11,minHeight:51,paddingHorizontal:17,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,marginTop:17},primaryButtonText:{color:'#FFF',fontSize:15,fontWeight:'700'},footerText:{color:'#B9B7D8',fontSize:11,marginTop:28},
 screen:{flex:1,backgroundColor:'#F6F6FB'},screenIntro:{paddingHorizontal:21,paddingTop:23,paddingBottom:17},pageEyebrow:{color:'#77758F',fontSize:10,fontWeight:'800',letterSpacing:1.5,marginBottom:7},pageTitle:{color:NAVY,fontSize:27,fontWeight:'800'},pageSubtitle:{color:'#77758F',fontSize:13,marginTop:5},refreshRow:{paddingHorizontal:21,paddingBottom:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionLabel:{color:'#77758F',fontSize:10,fontWeight:'800',letterSpacing:1.2},refreshText:{color:'#9290A3',fontSize:10},listContent:{paddingHorizontal:17,paddingBottom:22},emptyList:{flexGrow:1,justifyContent:'center',alignItems:'center',padding:25},eventCard:{backgroundColor:'#FFF',borderRadius:15,marginBottom:12,padding:15,flexDirection:'row',alignItems:'center',elevation:2,shadowColor:NAVY,shadowOpacity:.06,shadowRadius:8,shadowOffset:{width:0,height:3}},eventAccent:{width:4,alignSelf:'stretch',backgroundColor:'#E8B84A',borderRadius:3,marginRight:12},eventDate:{color:'#77758F',fontSize:11,fontWeight:'600',marginBottom:5},eventTitle:{color:NAVY,fontSize:15,fontWeight:'800',marginBottom:6},venueRow:{flexDirection:'row',alignItems:'center',gap:4},eventVenue:{color:'#77758F',fontSize:12},emptyText:{color:'#77758F',fontSize:14,textAlign:'center',marginTop:10},
 profileHeader:{paddingHorizontal:21,paddingTop:25,paddingBottom:18},profileCard:{marginHorizontal:20,backgroundColor:'#FFF',borderRadius:20,padding:24,alignItems:'center',elevation:2},avatar:{width:88,height:88,borderRadius:44,backgroundColor:NAVY,alignItems:'center',justifyContent:'center',marginBottom:13},avatarText:{color:'#FFF',fontSize:28,fontWeight:'800'},profileName:{color:NAVY,fontSize:20,fontWeight:'800'},profileCaption:{color:'#9290A3',fontSize:12,marginTop:4},profileDivider:{height:1,backgroundColor:'#ECEBF2',width:'100%',marginVertical:19},profileInfoRow:{flexDirection:'row',alignItems:'center',width:'100%',gap:11,marginVertical:7},profileInfoText:{color:'#55536D',fontSize:13},logoutButton:{marginHorizontal:20,marginTop:18,minHeight:51,borderRadius:12,borderWidth:1,borderColor:'#F0DADA',backgroundColor:'#FFF',flexDirection:'row',justifyContent:'center',alignItems:'center',gap:8},logoutText:{color:'#D64545',fontWeight:'700',fontSize:14},
 tabBar:{height:63,paddingTop:5,paddingBottom:5,borderTopColor:'#ECEBF2',backgroundColor:'#FFF'},tabLabel:{fontSize:10,fontWeight:'600'},headerSaveButton:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:6,paddingVertical:5},headerSaveText:{color:'#FFF',fontWeight:'700',fontSize:13},detailsContent:{padding:22,paddingBottom:35},detailsIcon:{width:68,height:68,borderRadius:18,backgroundColor:NAVY,alignItems:'center',justifyContent:'center',marginBottom:21},detailsDate:{color:'#77758F',fontSize:13,fontWeight:'700',marginBottom:8},detailsTitle:{color:NAVY,fontSize:27,fontWeight:'800',lineHeight:34},detailsVenueRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:13,marginBottom:23},detailsVenue:{color:NAVY,fontSize:14,fontWeight:'600'},descriptionCard:{backgroundColor:'#FFF',borderRadius:16,padding:19,elevation:1},descriptionText:{color:'#55536D',fontSize:14,lineHeight:23,marginTop:12},saveBodyButton:{marginTop:22},notFoundBox:{flex:1,alignItems:'center',justifyContent:'center'}
});
