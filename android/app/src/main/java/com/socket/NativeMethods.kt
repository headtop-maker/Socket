package com.socket;

import android.widget.Toast

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Environment

import android.provider.DocumentsContract
import android.util.Log
import java.net.ServerSocket
import kotlin.concurrent.thread
import com.facebook.react.bridge.*
import java.io.*
import java.net.Socket
import java.util.*
import java.util.concurrent.Executors
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import java.net.SocketException
import com.facebook.react.bridge.Arguments



class NativeMethods(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    var activity: Activity? = null
    var promise: Promise? = null

    private val DURATION_SHORT_KEY = "SHORT"
    private val DURATION_LONG_KEY = "LONG"
    val PICK_PDF_FILE = 2
    var fileParams = ""
    var mEmitter: RCTDeviceEventEmitter? = null
    var serverAddress = ""



    override fun getName(): String {
        return "NativeMethods"
    }

    override fun getConstants(): kotlin.collections.Map<String, Any> {
        val constants = HashMap<String, Any>()
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT)
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG)
        return constants
    }


    fun sendEvent(eventName: String, message: String) {
        val params = Arguments.createMap()
        params.putString("message", message)
        if (mEmitter == null) {
            mEmitter = reactApplicationContext.getJSModule(RCTDeviceEventEmitter::class.java)
        }
        mEmitter?.emit(eventName, params)
    }

    @ReactMethod
    fun show(message: String, duration: Int) {
        Toast.makeText(reactApplicationContext, message, duration).show()
    }

    @ReactMethod
    fun startMinWebServer() {
        Toast.makeText(reactApplicationContext, "Start web server", Toast.LENGTH_LONG).show()
        serverWeb()
    }

    @ReactMethod
    fun startFileTypeServers() {
        Toast.makeText(reactApplicationContext, "Start file,type servers", Toast.LENGTH_LONG).show()
        serverFile();serverType()
    }

    @ReactMethod
    fun sendFile(serverAddress:String ,  fileName: String, fileType: String, fileByteSize: Int, fileUri: String) {
        this.serverAddress = serverAddress
        var currentUri = Uri.parse(fileUri)
        Log.d("sendParams", "$serverAddress$fileName$fileType$fileByteSize$fileUri  :  $currentUri")
        clientType("$fileName:$fileType:$fileByteSize",currentUri)
    }

    @ReactMethod
    fun getFilesFromPath(successCallback: Callback) {
        val arrayFile = Arguments.createArray()
        listFile()?.forEach { arrayFile.pushString(it.toString())  }

        successCallback.invoke(arrayFile)

    }


    @ReactMethod
    fun openFile(promise: Promise) {
        this.promise = promise;
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
                val fileParams: WritableMap = WritableNativeMap()
                super.onActivityResult(requestCode, resultCode, intent)
                intent?.data?.also { uri ->
                    Log.d("URINative", uri.toString())
                    val cursor = uri.let { it1 ->
                        reactApplicationContext.contentResolver.query(
                            it1,
                            null,
                            null,
                            null,
                            null
                        )
                    }
                    cursor?.moveToFirst()
                    println(cursor?.getString(2))
                    fileParams.putString("fileName",cursor?.getString(2)?.split(".")!![0])
                    fileParams.putString("fileType", cursor.getString(2)?.split(".")!![1])
                    fileParams.putInt("fileByteSize", cursor.getString(5).toInt())
                    fileParams.putString("fileUri", uri.toString())
                    promise?.resolve(fileParams)

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

    fun sendOnUI(eventName: String,message: String){
        runOnUiThread(Runnable {
            sendEvent(eventName, message)
        })
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
                listFile()?.forEach { writer.write("<li>" + it.toString() + "</li>") }
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
        val server: ServerSocket
        try {
            server = ServerSocket(9999)
            thread {
                println("Server running on port ${server.localPort}")
                while (true) {
                    var writeLoop = true
                    val client = server.accept()
                    val inStream = client.getInputStream()
                    val outFileStream =
                        FileOutputStream(
                            "/storage/emulated/0/Download/${fileParams.split(":")[0]}${UUID.randomUUID()}.${
                                fileParams.split(
                                    ":"
                                )[1]
                            }"
                        )
                    var countBytes: Int
                    var i = 0;
                    sendOnUI("status", "loading")
                    do {
                        countBytes = inStream.read()
                        if (countBytes != -1) {
                            outFileStream.write(countBytes)
                            fileParams.split(":")[2].toInt()

//                            when (i) {
//                                fileParams.split(":")[2].toInt() * 0,1->Log.d("percent", "10")
//                                fileParams.split(":")[2].toInt() * 0,2->Log.d("percent", "20")
//                                fileParams.split(":")[2].toInt() * 0,3->Log.d("percent", "30")
//                                fileParams.split(":")[2].toInt() * 0,4->Log.d("percent", "40")
//                                fileParams.split(":")[2].toInt() * 0,5->Log.d("percent", "50")
//                                fileParams.split(":")[2].toInt() * 0,6->Log.d("percent", "60")
//                                fileParams.split(":")[2].toInt() * 0,7->Log.d("percent", "70")
//                                fileParams.split(":")[2].toInt() * 0,8->Log.d("percent", "80")
//                                fileParams.split(":")[2].toInt() * 0,9->Log.d("percent", "90")
//                            }
//                            sendOnUI("status", "loading")
//                            i++
                        } else {
                            Log.d("URINative", "server receive file")
                            sendOnUI("status", "receive")
                            runOnUiThread(Runnable {
                                Toast.makeText(
                                    reactApplicationContext,
                                    "server receive file",
                                    Toast.LENGTH_LONG
                                ).show()
                            })
                            writeLoop = false
                            outFileStream.close()
                        }
                    } while (writeLoop)
                    inStream.close()
                    client.close()
                }
            }
        } catch (se: SocketException) {
            sendOnUI("status", "failure")
            runOnUiThread(Runnable {
                Toast.makeText(
                    reactApplicationContext,
                    "Server FILE ERROR" + se.message.toString(),
                    Toast.LENGTH_LONG
                ).show()
            })
        }
    }

    fun serverType() {
        try {
            val server = ServerSocket(9998)
            thread {
                println("Server running on port ${server.localPort}")
                while (true) {
                    val client = server.accept()
                    val bufferedWriter =
                        BufferedWriter(OutputStreamWriter(client.getOutputStream()))
                    val bufferReader = BufferedReader(InputStreamReader(client.getInputStream()))

                    val request = bufferReader.readLine()
                    fileParams = request;
                    Log.d("URINative fileType", fileParams)
                    if (fileParams !== "") {
                        bufferedWriter.write("ok")
                    }
                    bufferedWriter.newLine()
                    bufferedWriter.flush()
                    bufferReader.close()
                    bufferedWriter.close()
                    client.close()
                }
            }
        } catch (se: SocketException) {
            runOnUiThread(Runnable {
                Toast.makeText(
                    reactApplicationContext,
                    "Server TYPE ERROR " + se.message.toString(),
                    Toast.LENGTH_LONG
                ).show()
            })
        }

    }

    fun clientFile(uri: Uri, size: Int) {
        Executors.newSingleThreadExecutor().execute {
            try {
                var sendLoop = true
                var client = Socket(serverAddress, 9999)
//            var file = FileInputStream("/storage/emulated/0/Download/uv2021psn.pdf")
                var file =
                    uri.let { it1 -> reactApplicationContext.contentResolver.openInputStream(it1) }
                val out = client.getOutputStream()
                val bytes = ByteArray(size)
                var countBytes: Int
                sendOnUI("client", "sending")
                do {
                    if (file != null) {
                        countBytes = file.read(bytes)
                        if (countBytes > 0) {
                            out.write(bytes, 0, countBytes)
                        } else {
                            println("client send file")
                            sendOnUI("client", "sent")
                            sendLoop = false
                            file.close()
                            out.close()

                        }
                    }
                } while (sendLoop)
                client.close()
            } catch (se: SocketException) {
                sendOnUI("client", "failure")
                runOnUiThread(Runnable {
                    Toast.makeText(
                        reactApplicationContext,
                        "Send file ERROR " + se.message.toString(),
                        Toast.LENGTH_LONG
                    ).show()
                })
            }
        }
    }

    fun clientType(fileParams: String, uri: Uri) {
        Executors.newSingleThreadExecutor().execute {
            try {
                val client = Socket(serverAddress, 9998)
                val bufferedWriter = BufferedWriter(OutputStreamWriter(client.getOutputStream()))
                val bufferReader = BufferedReader(InputStreamReader(client.getInputStream()))
                bufferedWriter.write(fileParams) // перенос строки очень важен
                bufferedWriter.newLine()
                bufferedWriter.flush()
                println("on client -> " + bufferReader.readLine())
                if (bufferReader.readLine() !== "") {
                    println(fileParams)
                    clientFile(uri, fileParams.split(":")[2].toInt())
                }
                bufferReader.close()
                bufferedWriter.close()
                client.close()
            } catch (se: SocketException) {
                runOnUiThread(Runnable {
                    Toast.makeText(
                        reactApplicationContext,
                        "Send type ERROR " + se.message.toString(),
                        Toast.LENGTH_LONG
                    ).show()
                })
            }
        }
    }

}

