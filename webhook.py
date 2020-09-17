import os, sys
from os.path import dirname, join, abspath
from flask import Flask
from requests.utils import requote_uri
import json
import ast 
from flask import jsonify
import time
from flask import request
# from flask_cors import CORS
import requests
import time

app = Flask(__name__)

@app.route('/api/coinbase_reciver/', methods=['GET', 'POST'])
def webhook():
    try:
        if request.method == 'POST':
            post_data = request.json
            payment_detail = post_data.get('event').get('data').get('payments')[0]
            payment_detail = payment_detail.get('value').get('crypto')
            crypto = payment_detail.get('currency')
            amount = payment_detail.get('amount')
            print("*"*60)
            print ('payment received Currency: {} amount : {}'.format(crypto,amount))
            print("*"*60)
            if crypto == 'ETH':
                print("Time delay of 2 min for Prepering transaction")
                time.sleep(120)
                print("*"*60)
                print ("Processing Transaction..........")
                print("*"*60)
                url = 'http://localhost:4000/api/forward_eth'
                forward_eth_resp = requests.post(url, data = {})
                if forward_eth_resp:
                    print (forward_eth_resp.text)
            elif crypto == 'DAI':
                print("Time delay of 2 min for Prepering transaction")
                time.sleep(120)
                print("*"*60)
                print ("Processing Transaction..........")
                print("*"*60)
                url = 'http://localhost:4000/api/forward_dai'
                forward_eth_resp = requests.post(url, data = {})
                if forward_eth_resp:
                    print (forward_eth_resp.text)                
            elif crypto == 'USDC':
                print("Time delay of 2 min for Prepering transaction")
                time.sleep(120)
                print("*"*60)
                print ("Processing Transaction..........")
                print("*"*60)
                url = 'http://localhost:4000/api/forward_usdc'
                forward_eth_resp = requests.post(url, data = {})
                if forward_eth_resp:
                    print (forward_eth_resp.text)

            return success_response({})

        if request.method == 'GET':
            return success_response({})
        
    except Exception as e:
        print (e)
        return error_response({})

def success_response(params = {}):
    params['status'] = True
    params['message'] = 'Sucess'
    return jsonify(params),200


def error_response(params = {}):
    params['status'] = False
    return jsonify(params),500


if __name__ == "__main__":
    app.run(debug=False,host= '0.0.0.0', port='5001')
