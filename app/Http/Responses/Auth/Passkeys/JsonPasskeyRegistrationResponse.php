<?php

namespace App\Http\Responses\Auth\Passkeys;

use Laravel\Passkeys\Contracts\PasskeyRegistrationResponse;
use Laravel\Passkeys\Passkey;

class JsonPasskeyRegistrationResponse implements PasskeyRegistrationResponse
{
    private ?Passkey $passkey = null;

    public function withPasskey(Passkey $passkey): static
    {
        $this->passkey = $passkey;

        return $this;
    }

    public function toResponse($request)
    {
        $data = ['status' => 'passkey-registered'];

        if ($this->passkey instanceof Passkey) {
            $data['id'] = (string) $this->passkey->id;
            $data['name'] = $this->passkey->name;
        }

        return response()->json($data);
    }
}
