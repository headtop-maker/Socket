package com.socket;

import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import java.util.HashMap

import android.app.Activity
import android.content.Intent
import android.os.Environment
import android.provider.DocumentsContract
import android.util.Log
import java.io.File
import java.io.OutputStreamWriter
import java.net.ServerSocket
import kotlin.concurrent.thread
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.BaseActivityEventListener


class NativeMethods(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext){
    var activity: Activity? = null

    private val DURATION_SHORT_KEY = "SHORT"
    private val DURATION_LONG_KEY = "LONG"
    val PICK_PDF_FILE = 2

    override fun getName(): String {
        return "NativeMethods"
    }

    override fun getConstants(): kotlin.collections.Map<String, Any> {
        val constants = HashMap<String,Any>()
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT)
        constants.put(DURATION_LONG_KEY,Toast.LENGTH_LONG)
        return constants
    }

    @ReactMethod
    fun show(message:String,duration: Int){
        Toast.makeText(reactApplicationContext,message,duration).show()
    }


    @ReactMethod
    fun startMinWebServer(){
        Toast.makeText(reactApplicationContext,"Start web server",Toast.LENGTH_LONG).show()
        serverWeb()
    }


    @ReactMethod
    fun openFile() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
            putExtra(DocumentsContract.EXTRA_INITIAL_URI, Environment.DIRECTORY_DOWNLOADS)
        }
        reactApplicationContext.startActivityForResult(intent, 1, null);
    }

    private val activityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity?,
                requestCode: Int,
                resultCode: Int,
                intent: Intent?
            ) {
                super.onActivityResult(requestCode, resultCode, intent)
                intent?.data?.also { uri ->
                    Log.d("URINative",uri.toString())}
            }
        }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    fun listFile(): Array<out File>? {
        val directory = File("/storage/emulated/0/Download/")
        val files = directory.listFiles()
        return files
    }
    fun serverWeb() {
        var count: Int = 0
        val server = ServerSocket(9997)
        thread {

            while (true) {
                val client = server.accept()
                println("client" + (count++))
                var writer = OutputStreamWriter(client.getOutputStream())
                writer.write(// для сайта
                    "HTTP/1.0 200 OK\r\n" + // для сайта
                            "Content-type: text/html; charset=utf-8\r\n" + // для сайта
                            "\r\n" +
                            "<H1>Загрузки</H1>" // для сайта
                )
                writer.write("<ul>")
                listFile()?.forEach { writer.write("<li>"+it.toString()+"</li>")  }
                writer.write("</ul>")
                writer.write("socket client number " + count)
                writer.flush()

                writer.close()
                client.close()
            }
        }
    }

}

