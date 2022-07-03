package com.socket;

import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.DocumentsContract
import android.util.Log
import android.widget.TextView
import java.net.ServerSocket
import kotlin.concurrent.thread
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.BaseActivityEventListener
import java.io.*
import java.net.Socket
import java.util.*
import java.util.concurrent.Executors
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread

import com.facebook.react.bridge.WritableMap
import com.th3rdwave.safeareacontext.getReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter





class NativeMethods(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext){
    var activity: Activity? = null

    private val DURATION_SHORT_KEY = "SHORT"
    private val DURATION_LONG_KEY = "LONG"
    val PICK_PDF_FILE = 2
    var fileType = ""
    var mEmitter: RCTDeviceEventEmitter? = null

    override fun getName(): String {
        return "NativeMethods"
    }

    override fun getConstants(): kotlin.collections.Map<String, Any> {
        val constants = HashMap<String,Any>()
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT)
        constants.put(DURATION_LONG_KEY,Toast.LENGTH_LONG)
        return constants
    }



    fun sendEvent(eventName:String,message:String){
        val params = Arguments.createMap()
        params.putString("message",message)
        if(mEmitter == null){
            mEmitter= reactApplicationContext.getJSModule(RCTDeviceEventEmitter::class.java)
        }
        mEmitter?.emit(eventName,params)
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
    fun startFileTypeServers(){
        Toast.makeText(reactApplicationContext,"Start file,type servers",Toast.LENGTH_LONG).show()
        serverFile();serverType()
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
                    Log.d("URINative",uri.toString())
                    val cursor = uri.let { it1 -> reactApplicationContext.contentResolver.query(it1, null, null, null, null) }
                    cursor?.moveToFirst()
                    println(cursor?.getString(2))
                    Log.d("URINative", cursor?.getString(2).toString())
                    val getFileType = cursor?.getString(2)?.split(".")!![1]
                    thread {
                        clientType(getFileType, uri)
                    }
                }

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

    fun serverFile() {
        var count: Int = 0
        val server = ServerSocket(9999)
        thread {
            println("Server running on port ${server.localPort}")
            while (true) {
                var writeLoop = true
                val client = server.accept()
                println("client -> " + (count++))
                var inStream = client.getInputStream()
                println("fileType -> " + fileType)
                var outFileStream =
                    FileOutputStream("/storage/emulated/0/Download/UploadFile${UUID.randomUUID()}.${fileType}")
                var countBytes: Int
//                sendEvent("count","start")
                var i = 0;
                runOnUiThread(Runnable {
                    sendEvent("count","start")
                })
                do {
                    countBytes = inStream.read()
                    if (countBytes != -1) {
                        outFileStream.write(countBytes)
//                        i++

                    } else {
                        println("server receive file")
                        Log.d("URINative","server receive file")
                        runOnUiThread(Runnable {
                            sendEvent("count","stop")
                        })
                        writeLoop = false
                        outFileStream.close()
                    }
                } while (writeLoop)
                inStream.close()
                client.close()
            }
        }

    }
    fun serverType() {
        var count = 0
        val server = ServerSocket(9998)
        thread {
            println("Server running on port ${server.localPort}")
            while (true) {
                val client = server.accept()
                println("client -> " + (count++))
                var bufferedWriter = BufferedWriter(OutputStreamWriter(client.getOutputStream()))
                var bufferReader = BufferedReader(InputStreamReader(client.getInputStream()))
                var request = bufferReader.readLine()
                println("on server request ->  " + request)
                fileType = request;
                println("on server fileType -> " + fileType)
                Log.d("URINative fileType", fileType)
                if (fileType !== "") {
                    bufferedWriter.write("ok")
                }

                bufferedWriter.newLine()
                bufferedWriter.flush()
                bufferReader.close()
                bufferedWriter.close()
                client.close()
            }
        }
    }
    fun clientFile(uri: Uri) {
        Executors.newSingleThreadExecutor().execute {
            var sendLoop = true
            var client = Socket("192.168.0.103", 9999)

//            var file = FileInputStream("/storage/emulated/0/Download/uv2021psn.pdf")
            var file = uri.let { it1 -> reactApplicationContext.contentResolver.openInputStream(it1) }

            val out = client.getOutputStream()
            val bytes = ByteArray(5242880)
            var countBytes: Int
            do {
                if (file != null) {
                    countBytes = file.read(bytes)
                    if (countBytes > 0) {
                        out.write(bytes, 0, countBytes)
                    } else {
                        println("client send file")

                        sendLoop = false
                        file.close()
                        out.close()
                    }
                }
            } while (sendLoop)
            client.close()
        }
    }
    fun clientType(fileType: String, uri: Uri) {
        Executors.newSingleThreadExecutor().execute {
            val client = Socket("192.168.0.103", 9998)
            val bufferedWriter = BufferedWriter(OutputStreamWriter(client.getOutputStream()))
            val bufferReader = BufferedReader(InputStreamReader(client.getInputStream()))
            bufferedWriter.write(fileType) // перенос строки очень важен
            bufferedWriter.newLine()
            bufferedWriter.flush()
            println("on client -> " + bufferReader.readLine())

            if (bufferReader.readLine() !== "") {
                println(fileType)
                clientFile(uri)
            }
            bufferReader.close()
            bufferedWriter.close()
            client.close()
        }
    }

}

