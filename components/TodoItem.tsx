import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

type Props = {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (todo: Todo) => void;
};

export default function TodoItem({
    todo,
    onToggle,
    onDelete,
    onEdit,
}: Props) {

    const scale = useRef(new Animated.Value(1)).current;

    const bgColor = scale.interpolate({
        inputRange: [0.97, 1],
        outputRange: ["#E5E7EB", "#F9F9F9"],
    });

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onLongPress={() => onEdit(todo)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ scale }],
                        backgroundColor: bgColor,
                    },
                ]}
            >
                {/* LEFT: checkbox + text */}
                <View style={styles.left}>
                    <Pressable
                        onPress={() => onToggle(todo.id)}
                        hitSlop={10}
                    >
                        <Ionicons
                            name={todo.completed ? "checkbox" : "square-outline"}
                            size={24}
                            color={todo.completed ? "#4CAF50" : "#999"}
                        />
                    </Pressable>

                    <Text
                        style={[
                            styles.text,
                            todo.completed && styles.completedText,
                        ]}
                        numberOfLines={2}
                    >
                        {todo.text}
                    </Text>
                </View>

                {/* RIGHT: delete */}
                <Pressable
                    onPress={() => onDelete(todo.id)}
                    hitSlop={10}
                >
                    <Ionicons name="trash-outline" size={22} color="red" />
                </Pressable>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 20,
        marginTop: 20,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    text: {
        fontSize: 16,
        marginLeft: 12,
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#999",
    },

});
