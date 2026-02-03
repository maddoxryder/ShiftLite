package com.capstone.shiftlite

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.capstone.shiftlite.ui.theme.ShiftLiteTheme
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.*
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.Alignment
import com.capstone.shiftlite.ui.home.HomeScreen
import com.capstone.shiftlite.ui.login.LoginScreen
import com.capstone.shiftlite.ui.Screen
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ShiftLiteTheme {
                var currentScreen by remember { mutableStateOf(Screen.LOGIN) }

                when (currentScreen) {
                    Screen.LOGIN -> LoginScreen(
                        onLoginClick = { currentScreen = Screen.HOME }
                    )
                    Screen.HOME -> HomeScreen(
                        onLogoutClick = { currentScreen = Screen.LOGIN }
                    )
                }
            }
        }

    }
}



