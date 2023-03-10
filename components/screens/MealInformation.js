import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView, View, Text, TextInput, ScrollView, Dimensions, FlatList, Image } from 'react-native'

import Header from '../modules/Header'
import mealinfoStyles from '../../assets/styles/mealinformation'
import MealCard, { ViewSuggestion } from '../modules/MealCard';
import daily_value from '../fuzzy/daily_value';
import { Context } from "../global_context/GlobalContext";
import recommendation from '../fuzzy/recommendation';

export default function MealInformation( props, ){
    const { 
            onPress, 
            buttonText = 'View Suggestions',
    } = props;

    const [foodData, setFoodData] = useState();
    const [calories, setCalories] = useState(0);
    const [filename, setFilename] = useState();
    let category;
    const [lackfood, setLackFood] = useState();
    const [reminder, setReminder] = useState();
    const [lackfoods, setLackFoods] = useState();
    const [ query, setQuery ] = useState([]);
    let [isLoading, setLoading] = useState(true);
    let [error, setError] = useState();

    const { predictedResult, setPredictedResult } = useContext(Context);
    const { foodrecommendation, setFoodRecommendation} = useContext(Context);
    let space = ' ', tempquery = '';
    for(let i=0;i<Object.keys(predictedResult).length;i++){
        tempquery = tempquery + space + predictedResult[i].label;
    }

    let url = 'https://trackapi.nutritionix.com/v2/natural/nutrients?'
    let header = new Headers ();
    header.append('Content-Type', 'application/json')
    header.append('x-app-id', 'dc8f2b01')
    header.append('x-app-key', '7ca38ca16b834b43a0242fd71259adb5')

    let jsonQuery = JSON.stringify({"query": tempquery});

    let request = new Request (url, {
        method: 'POST',
        headers: header,
        mode: 'cors',
        body: jsonQuery,
    })

    useEffect(() => {
        fetch(request)
            .then((response) => response.json())
            .then((json) => {
                setFoodData((json.foods));
                setFilename('Filename.jpeg');
                },
                (error) => {
                    setLoading(false);
                    setError(error);
                }
            )
            .finally(() => setLoading(false))    
    }, []);
    
    let tempCalories=0;

    function totalCalories(item){
        tempCalories+=item.nf_calories;
        tempCalories=Math.round(tempCalories);
        return setCalories(tempCalories);
    };
    let counter = 0, joint = ' and ', tempcateg ='', lack, lackfoodss;

    function fuzzyDaily(item){
        let x = daily_value(item);
        category = x.category;

        if(counter > 0)
        tempcateg = tempcateg + joint + x.category;
        else
        tempcateg = x.category;
        lack = recommendation(tempcateg);
        setFoodRecommendation(lack.lackgroup);
        setReminder(lack.reminder);
        lackfoodss = lack.foods;
        counter = counter+1;
    };
    return (
        <SafeAreaView style={mealinfoStyles.screen}>
            <Header textProps={"Meal Information"} />
            <ScrollView nestedScrollEnabled={true} style={mealinfoStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={mealinfoStyles.mealThumbContainer}>
                    <View style={mealinfoStyles.mealThumbSecondContainer}>
                        <Image source={"../assets/images/DOST_FNRI_logo.png"} style={mealinfoStyles.thumbnailImage} resizeMode={'contain'}/> 
                    </View>
                    <Text style={mealinfoStyles.mealThumbText}>{filename}</Text>
                </View>
                <View name='Your Meal Contains'>
                    <View style={mealinfoStyles.headerContainer}>
                        <Text style={mealinfoStyles.headerStyle}>Your meal contains:</Text>
                    </View>
                </View>
                <FlatList
                data={foodData}
                keyExtractor={(item) => {item.food_name, item.food_category, item.serving_qty, item.serving_unit, item.serving_weight_grams, item.nf_calories, item.photo.thumb}}
                renderItem={({ item }) => (
                    totalCalories(item),
                    fuzzyDaily(item),
                    <MealCard 
                    foodName={item.food_name} 
                    foodCategory={category}
                    foodServing={item.serving_qty}
                    foodServingUnit={item.serving_unit}
                    foodServingWeight={item.serving_weight_grams}
                    foodCalories={item.nf_calories}
                    foodImage={item.photo.thumb}
                    />
                )}
                />
                {/* <MealCard 
                        foodName={'Rice'}
                        foodCategory={'Go'}
                        foodServing={'1cup (158g)'}
                        foodCalories={'205'}
                        foodImage={require("../../assets/images/DOST_FNRI_logo.png")}
                /> 
                <MealCard 
                        foodName={'Adobo'}
                        foodCategory={'Grow'}
                        foodServing={'241g'}
                        foodCalories={'454'}
                        foodImage={require("../../assets/images/DOST_FNRI_logo.png")}
                /> */}
                <View name='Summary' style={mealinfoStyles.summaryContainer}>
                    <View style={mealinfoStyles.summaryBorder}>
                        <Text style={mealinfoStyles.headerStyle}>
                            Summary:
                        </Text>
                    </View> 
                    {/* meal info goes here. */}
                    <View style={mealinfoStyles.totalCaloriesContainer}>
                        <Text style={mealinfoStyles.boldtextStyle}>
                            Total Calories:        
                        </Text>
                        <Text style={mealinfoStyles.boldtextStyle}>
                            {calories}  {/* Fetches the value of calories */}    
                        </Text>
                    </View>
                    <View style={mealinfoStyles.remainingCaloriesContainer}>
                        <View style={mealinfoStyles.remainingCaloriesTextContainer}>
                            <Text style={mealinfoStyles.boldtextStyle}>
                                Remaining suggested calories to be intaked for today:
                            </Text>
                        </View>
                        <View style={mealinfoStyles.textContainer}>
                            <Text style={mealinfoStyles.boldtextStyle}>
                                {2000-calories}  {/* Fetches the value of remaining calories */}
                            </Text>
                        </View>
                    </View> 
                    <View style={mealinfoStyles.headerContainer}>
                        <Text style={mealinfoStyles.boldtextStyle}>
                        Your meal lacks a 
                        <Text style={mealinfoStyles.glowinnerText}> {foodrecommendation}</Text>
                        <Text style={mealinfoStyles.boldtextStyle}> food</Text>
                        </Text>
                        <Text style={mealinfoStyles.ReminderboldtextStyle}>Reminder:</Text>
                        <Text style={mealinfoStyles.boldtextStyle}>
                        {reminder}
                        </Text>

                    </View>
                    <ViewSuggestion/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}