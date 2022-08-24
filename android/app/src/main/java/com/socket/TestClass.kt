// package com.socket

// import android.content.Intent
// import android.os.Environment
// import android.provider.DocumentsContract
// import android.util.Log
// import androidx.activity.result.contract.ActivityResultContracts
// import androidx.appcompat.app.AppCompatActivity
// import kotlin.concurrent.thread

// class TestClass(name:String): AppCompatActivity() {

//     val firstProperty = "Первое свойство: $name".also(::println)

//     init {
//         Log.d("ClassInit 1",name)
//         println("Первый блок инициализации: ${name}")
//     }

//     val secondProperty = "Второе свойство: ${name.length}".also(::println)

//     init {
//         Log.d("ClassInit 2",name)
//         println("Второй блок инициализации: ${name.length}")
//     }

// }